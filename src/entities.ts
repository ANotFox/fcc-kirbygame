import {
    AreaComp,
    BodyComp,
    DoubleJumpComp,
    GameObj,
    HealthComp,
    KaboomCtx,
    OpacityComp,
    PosComp,
    ScaleComp,
    SpriteComp,
  } from "kaboom";
import {scale} from "./constants";

type playergameobj = GameObj<
  SpriteComp &
    AreaComp &
    BodyComp &
    PosComp &
    ScaleComp &
    DoubleJumpComp &
    HealthComp &
    OpacityComp & {
      speed: number;
      direction: string;
      isinhaling: boolean;
      isfull: boolean;
    }
>;

export function makeplayer (k: KaboomCtx, posx: number, posy: number) 
{
    const player = k.make
    ([
        k.sprite("assets", {anim: "krbidle"}),
        //hitbox positioned at x = 4 y = 5.9 relative to the sprite
        k.area
        ({ 
            shape: new k.Rect
            (
                k.vec2(4, 5.9), 8, 10
            ) 
        }),
        k.body(),
        k.pos(posx *scale, posy*scale),
        k.scale(scale),
        k.doubleJump(10),
        k.health(3),
        k.opacity(1),
        {
            speed: 300, 
            direction: "right",
            isinhaling: false,
            isfull: false,
        },
        "player",
    ]);

    player.onCollide("enemy", async (enemy : GameObj) => {
        if (player.isinhaling && enemy.isinhalable)
            {
                player.isinhaling = false;
                k.destroy(enemy);
                player.isfull = true;
                return;
            }

        if (player.hp()=== 0) 
            {
                k.destroy(player);
                // k.go(globalgamestate.currentscene);
                k.go("level-1");
                return;
            }
        player.hurt();
        await k.tween
        (
            player.opacity, 0, 0.1,
            (val) => (player.opacity = val),
            k.easings.easeInSine
        );

        await k.tween
        (
            player.opacity, 1, 0.05,
            (val) => (player.opacity = val),
            k.easings.linear
        );
    });

    player.onCollide
    ("exit", () => 
        {
        k.go("level-2");
    } 
    );

    const krbinhaleeffect = k.add ([
        k.sprite("assets", {anim: "krbinhaleeffect"}),
        k.pos(),
        k.scale(scale),
        k.opacity(0),
        "krbinhaleeffect",
    ]);

    const inhalezone = player.add([
        k.area({shape: new k.Rect(k.vec2(0), 20, 4) }),
        k.pos(),
        "inhalezone",
    ]);
    inhalezone.onUpdate(() => {
        if (player.direction === "left") {
          inhalezone.pos = k.vec2(-14, 8);
          krbinhaleeffect.pos = k.vec2(player.pos.x - 60, player.pos.y + 0);
          krbinhaleeffect.flipX = true;
          return;
        }
        inhalezone.pos = k.vec2(14, 8);
        krbinhaleeffect.pos = k.vec2(player.pos.x + 60, player.pos.y + 0);
        krbinhaleeffect.flipX = false;
      });
    
      player.onUpdate(() => {
        if (player.pos.y > 2000) {
          k.go("level-1");
        }
      });
    
      return player;
    }

export function setcontrols (k: KaboomCtx, player: playergameobj) 
{
    const inhaleeffectref = k.get("krbinhaleeffect")[0];
    k.onKeyDown((key) => { 
        switch(key) {
            case "left":
                player.direction = "left";
                player.flipX = true;
                player.move(-player.speed, 0);
                break;
            case "right":
                player.direction = "right";
                player.flipX = false;
                player.move(player.speed, 0);
                break;
            case "z":
                if (player.isfull) {
                player.play("kirbfull");
                inhaleeffectref.opacity = 0;
                break;
                }
        
                player.isinhaling = true;
                player.play("krbinhaling");
                inhaleeffectref.opacity = 1;
                break;
            default:
            }
        });
        k.onKeyPress((key) => {
            switch (key) {
              case "x":
                player.doubleJump();
                break;
              default:
            }
          });
        k.onKeyRelease((key) => {
            switch (key) {
              case "z":
                if (player.isfull) {
                  player.play("krbinhaling");
                  const shootingStar = k.add([
                    k.sprite("assets", {
                      anim: "shootingStar",
                      flipX: player.direction === "right",
                    }),
                    k.area({ shape: new k.Rect(k.vec2(5, 4), 6, 6) }),
                    k.pos(
                      player.direction === "left"
                        ? player.pos.x - 80
                        : player.pos.x + 80,
                      player.pos.y + 5
                    ),
                    k.scale(scale),
                    player.direction === "left"
                      ? k.move(k.LEFT, 800)
                      : k.move(k.RIGHT, 800),
                    "shootingStar",
                  ]);
                  shootingStar.onCollide("platform", () => k.destroy(shootingStar));
        
                  player.isfull = false;
                  k.wait(1, () => player.play("krbidle"));
                  break;
                }
        
                inhaleeffectref.opacity = 0;
                player.isinhaling = false;
                player.play("krbidle");
                break;
              default:
            }
          });
        }

export function makeinhalable(k: KaboomCtx, enemy: GameObj) {
    enemy.onCollide("inhalezone", () => {
      enemy.isInhalable = true;
    });
  
    enemy.onCollideEnd("inhalezone", () => {
      enemy.isInhalable = false;
    });
  
    enemy.onCollide("shootingStar", (shootingStar: GameObj) => {
      k.destroy(enemy);
      k.destroy(shootingStar);
    });
  
    const playerref = k.get("player")[0];
    enemy.onUpdate(() => {
      if (playerref.isinhaling && enemy.isinhalable) {
        if (playerref.direction === "right") {
          enemy.move(-800, 0);
          return;
        }
        enemy.move(800, 0);
      }
    });
  }
  
  export function makeFlameEnemy(k: KaboomCtx, posX: number, posY: number) {
    const flame = k.add([
      k.sprite("assets", { anim: "flame" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(4, 6), 8, 10),
        collisionIgnore: ["enemy"],
      }),
      k.body(),
      k.state("idle", ["idle", "jump"]),
      "enemy",
    ]);
  
    makeinhalable(k, flame);
  
    flame.onStateEnter("idle", async () => {
      await k.wait(1);
      flame.enterState("jump");
    });
  
    flame.onStateEnter("jump", async () => {
      flame.jump(1000);
    });
  
    flame.onStateUpdate("jump", async () => {
      if (flame.isGrounded()) {
        flame.enterState("idle");
      }
    });
  
    return flame;
  }

  export function makeGuyEnemy(k: KaboomCtx, posX: number, posY: number) {
    const guy = k.add([
      k.sprite("assets", { anim: "guyWalk" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(2, 3.9), 12, 12),
        collisionIgnore: ["enemy"],
      }),
      k.body(),
      k.state("idle", ["idle", "left", "right", "jump"]),
      { isinhalable: true, speed: 100 },
      "enemy",
    ]);
  
    makeinhalable(k, guy);
  
    guy.onStateEnter("idle", async () => {
      await k.wait(1);
      guy.enterState("left");
    });
  
    guy.onStateEnter("left", async () => {
      guy.flipX = false;
      await k.wait(2);
      guy.enterState("right");
    });
  
    guy.onStateUpdate("left", () => {
      guy.move(-guy.speed, 0);
    });
  
    guy.onStateEnter("right", async () => {
      guy.flipX = true;
      await k.wait(2);
      guy.enterState("left");
    });
  
    guy.onStateUpdate("right", () => {
      guy.move(guy.speed, 0);
    });
  
    return guy;
  }

  export function makeBirdEnemy(
    k: KaboomCtx,
    posX: number,
    posY: number,
    speed: number
  ) {
    const bird = k.add([
      k.sprite("assets", { anim: "bird" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(4, 6), 8, 10),
        collisionIgnore: ["enemy"],
      }),
      k.body({ isStatic: true }),
      k.move(k.LEFT, speed),
      k.offscreen({ destroy: true, distance: 400 }),
      "enemy",
    ]);
  
    makeinhalable(k, bird);
  
    return bird;
  }