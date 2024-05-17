import {scale} from "./constants";
import {KaboomCtx} from "kaboom";

export async function makemap(k:KaboomCtx, name: string) {
    const mapdata = await (await fetch(`./${name}.json`)).json();

    const map = k.make([k.sprite(name), k.scale(scale), k.pos(0)]); 
    //creates but does not display game object

    const spawnpoints: {[key: string] :{x: number; y: number}[]}= {};

    for (const layer of mapdata.layers) {
        if(layer.name === "colliders") { //refer to json file to see what links to what
            for (const collider of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
                        collisionIgnore: ["platform", "exit"],
                    }),
                    collider.name !== "exit" ? k.body({isStatic: true}) : null,
                    k.pos(collider.x, collider.y),
                    collider.name !== "exit" ? "platform" : "exit",
                ]);
            }
            continue;
        }
        if (layer.name === "spawnpoints") {
            for (const spawnpoint of layer.objects) {
                if (spawnpoint[spawnpoint.name] ) {
                    spawnpoints[spawnpoint.name].push({
                        x: spawnpoint.x,
                        y: spawnpoint.y,
                    });
                    continue;
                }
                spawnpoints[spawnpoint.name] = [{x: spawnpoint.x, y: spawnpoint.y}];
            }
        }
    }
    return {map, spawnpoints};
}