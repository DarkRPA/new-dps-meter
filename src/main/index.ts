/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NetworkListerner } from './backend/controllers/NetworkListener.js'
import { ViewController } from './backend/view/ViewController.js'
import { app } from 'electron'

export const Network: NetworkListerner = new NetworkListerner()
export class Main {
  static StartingTime: number = 0
}

app.whenReady().then(() => {
  new ViewController();
  let networkListener = new NetworkListerner();
  networkListener.init();
})
