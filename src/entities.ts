import { GameObj, KaboomCtx } from "kaboom";
import {scale} from "./constants";

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
                    k.go(globalgamestate.currentscene);
                    return;
                }
    });
}