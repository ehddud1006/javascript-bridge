const BridgeGame = require('../model/BridgeGame.js');
const InputView = require('../view/InputView.js');
const OutputView = require('../view/OutputView.js');
const BridgeMaker = require('../BridgeMaker.js');
const BridgeRandomNumberGenerator = require('../BridgeRandomNumberGenerator.js');
const Bridge = require('../model/Bridge.js');
const { isCollectBridgeLength, isValidateMoveInput, isValidateRetryInput } = require('../utils/validator.js');
const { Console } = require('@woowacourse/mission-utils');

class BridgeGameController {
  constructor() {
    this.bridgeGame = new BridgeGame();
    this.bridge = new Bridge();
  }

  start() {
    InputView.readBridgeSize(this.createBridgeByUser.bind(this));
  }

  createBridgeByUser(bridgeLength) {
    try {
      isCollectBridgeLength(bridgeLength);

      this.bridge.setData('length', bridgeLength);
      const blueprint = BridgeMaker.makeBridge(bridgeLength, BridgeRandomNumberGenerator.generate);
      this.bridge.setData('blueprint', blueprint);

      InputView.readMoving(this.movingByUser.bind(this));
    } catch (error) {
      Console.print(error.message);
      this.start();
    }
  }

  movingByUser(move) {
    try {
      isValidateMoveInput(move);
      const isWrongAnswer = this.bridgeGame.move(move, this.bridge);
      OutputView.printMap(this.bridge);

      if (isWrongAnswer) {
        InputView.readGameCommand(this.askWantRetry.bind(this));
      } else {
        if (this.bridge.data.turn >= this.bridge.data.length) {
          OutputView.printResult(true, this.bridgeGame.retryCount, this.bridge);
        } else InputView.readMoving(this.movingByUser.bind(this));
      }
    } catch (error) {
      Console.print(error.message);
      InputView.readMoving(this.movingByUser.bind(this));
    }
  }

  askWantRetry(answer) {
    try {
      isValidateRetryInput(answer);
      if (answer === 'R') {
        this.bridgeGame.retry(this.bridge);
        this.bridgeGame.retryCount += 1;
        InputView.readMoving(this.movingByUser.bind(this));
      } else {
        OutputView.printResult(false, this.bridgeGame.retryCount, this.bridge);
      }
    } catch (error) {
      Console.print(error.message);
      InputView.readGameCommand(this.askWantRetry.bind(this));
    }
  }
}

module.exports = BridgeGameController;
