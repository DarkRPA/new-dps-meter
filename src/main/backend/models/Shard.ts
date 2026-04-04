/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DamagePacket } from './DamagePacket.js'
import { GLOBAL_PULL_TIME, Player } from './Player.js'

export class Shard {
  averageTimePerPull: number = 0
  packetList: Array<DamagePacket> = []
  lastPacket: DamagePacket | null = null
  finalDamage:number|undefined;
  finalElapsedTime:number|undefined;
  shardStart: number = 0
  shardEnd: number = 0

  constructor(player: Player) {
    this.averageTimePerPull = player.getAverageTimeBetweenPulls()
  }

  addPacket(paquete: DamagePacket) {
    if(Number.isNaN(paquete.dmg)) return;
    if (this.lastPacket == null) {
      this.shardStart = performance.now()
      this.lastPacket = paquete
      this.packetList.push(paquete)
      return 0
    }

    if (this.checkTimeDifference(paquete, this.lastPacket)) {
      if (this.shardEnd == 0) this.shardEnd = this.lastPacket.timestamp;
      return -1
    }

    this.lastPacket = paquete
    this.packetList.push(paquete)

    return 0
  }

  private checkTimeDifference(p0: DamagePacket, p1: DamagePacket) {
    return Math.abs(p1.timestamp - p0.timestamp) / 1000 > this.averageTimePerPull
  }

  getTotalDamage(): number {
    let result: number = 0

    if(this.shardEnd && this.finalDamage){
      return this.finalDamage;
    }

    for (let i = 0; i < this.packetList.length; i++) {
      let paqueteActual = this.packetList[i]

      result += paqueteActual?.dmg!
    }

    if(this.shardEnd){
      this.finalDamage = result;
    }

    return result
  }

  getElapsedTime(): number {
    if(this.shardEnd && this.finalElapsedTime){
      return this.finalElapsedTime;
    }

    let firstPacket = this.packetList[0]
    let result = 0;

    let firstTimestamp = firstPacket.timestamp;
    let secondTimestamp = (this.packetList.length > 1)?this.packetList[this.packetList.length-1].timestamp:firstTimestamp+(GLOBAL_PULL_TIME*1000);

    result = Math.abs((secondTimestamp - firstTimestamp)) / 1000;

    if(this.shardEnd){
      this.finalElapsedTime = result;
    }

    return result;
  }

  getDPS(): number {
    if (this.packetList.length <= 1) return 0
    let result = this.getTotalDamage() / this.getElapsedTime()
    if (Number.isNaN(result)) return 0
    return result
  }
}
