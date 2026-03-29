/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { Shard } from './Shard.js'
import { DamagePacket } from './DamagePacket.js'

export class Player {
  id:number = -1;
  guid: Array<Number> = []
  name: string = ''
  shardList: Array<Shard> = []
  activeShard: Shard | null = null
  averageTimeBetweenPulls: number = 6
  isLocalPlayer: boolean = false

  constructor(id:number, name: string, guid?: Array<Number>) {
    //this.id = Math.floor((Math.random()*10))
    this.id = id;
    if(guid)
      this.guid = guid;
    this.name = name;
    //this.startTest();
  }

  private addRandomPacket() {
    this.addPacket(new DamagePacket(Math.floor(Math.random() * 100)))
  }

  startTest() {
    setInterval(() => {
      this.addRandomPacket()
    }, Math.random() * 10000)
  }

  addPacket(DamagePacket: DamagePacket) {
    if (this.activeShard == null) {
      this.activeShard = new Shard(this)
      this.shardList.push(this.activeShard)
    }
    let code = this.activeShard.addPacket(DamagePacket)
    if (code == -1) {
      this.activeShard = new Shard(this)
      this.shardList.push(this.activeShard)
      this.activeShard.addPacket(DamagePacket)
    }
  }

  getAverageTimeBetweenPulls() {
    let totalWaitingTime = 0
    if (this.shardList.length <= 1) return this.averageTimeBetweenPulls
    for (let i = 1; i < this.shardList.length; i++) {
      let shard = this.shardList[i]
      let previousShard = this.shardList[i - 1]

      totalWaitingTime += shard?.shardStart! - previousShard?.shardEnd!
    }

    return totalWaitingTime / (this.shardList.length - 1)
  }

  getTotalDamage(): number{
    let result = 0;
    for(let i = 0; i < this.shardList.length; i++){
      let shard = this.shardList[i];
      result += shard.getTotalDamage();
    }

    return result;
  }

  getTotalDPS(): number{
    let result = 0;
    for(let i = 0; i < this.shardList.length; i++){
      let shard = this.shardList[i];
      result += shard.getElapsedTime();
    }

    return this.getTotalDamage()/result;
  }

  restartDmg(){
    this.activeShard = null;
    this.shardList = [];
  }
}
