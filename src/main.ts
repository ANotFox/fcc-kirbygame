import { makeBirdEnemy, makeFlameEnemy, makeGuyEnemy, makeplayer, setcontrols } from "./entities";
import {k} from "./kaboomCtx";
import { makemap } from "./utils";

async function gamesetup() { 
    // loading a sprite in kaboom, sprite file linked
    k.loadSprite("assets", "./kirby-like.png", {
        sliceX: 9, sliceY: 10,
        //9 sprites on x axis, 10 sprites on y axis, hence the appropriate splice
        // animation below
        anims: {
            krbidle: 0,
            krbinhaling: 1,
            krbfull: 2,
            // for more than one frame, use object like this
            //speed: x is then x frames per second
            krbinhaleeffect: { from: 3, to: 8, speed: 15, loop: true},
            shootingStar: 9,
            flame: {from: 36, to: 37, speed: 4, loop: true},
            guyIdle: 18,
            guyWalk: {from: 18, to: 19, speed: 4, loop: true},
            bird: {from: 27, to: 28, speed: 4, loop: true},
        },
    });

    k.loadSprite("level-1", "./level-1.png");
    const { map: level1layout, spawnpoints: level1SpawnPoints } = await makemap(
        k,
        "level-1"
      );    
    //create scenes using this
    k.scene("level-1", () => {
        k.setGravity(1800);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex("#f7d7db")),
            k.fixed(),
        ])
        k.add(level1layout);

        const kirb = makeplayer(
            k,
            level1SpawnPoints.player[0].x,
            level1SpawnPoints.player[0].y
        );

        setcontrols(k,kirb);
        k.add(kirb);
        k.camScale(k.vec2(0.7));
        k.onUpdate(() => {
            if (kirb.pos.x < level1layout.pos.x + 432)
              k.camPos(kirb.pos.x + 500, 800);
        });
      
        for (const flame of level1SpawnPoints.flame) {
            makeFlameEnemy(k, flame.x, flame.y);
          }
      
          for (const guy of level1SpawnPoints.guy) {
            makeGuyEnemy(k, guy.x, guy.y);
          }
      
          for (const bird of level1SpawnPoints.bird) {
            const possibleSpeeds = [100, 200, 300];
            k.loop(10, () => {
              makeBirdEnemy(
                k,
                bird.x,
                bird.y,
                possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
              );
            });
          
        };
    });
    k.go("level-1");


    
  












}

gamesetup();