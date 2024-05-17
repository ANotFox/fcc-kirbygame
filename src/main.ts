import {k} from "./kaboomCtx";
import { makemap } from "./utils";

async function gamesetup() { 
    // loading a sprite in kaboom, sprite file linked
    k.loadSprite("assets", "./kirby-like.png", {
        sliceX: 9, sliceY: 10,
        //9 sprites on x axis, 10 sprites on y axis, hence the appropriate splice
        // animation below
        anims: {
            krbIdle: 0,
            krbInhaling: 1,
            krbFull: 2,
            // for more than one frame, use object like this
            //speed: x is then x frames per second
            krbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true},
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
    });
    k.go("level-1");


}

gamesetup();