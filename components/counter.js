// IIFE - Immediately invoked function expression

(() => {
  const BTN_RESTART = 'btnRestart';
  const ID_CONTADOR = 'counter';
  const VALUE_COUNT = 100;
  const INTERVAL = 10;

  class CounterComponent {
    constructor() {
      this.initialize();
    }

    prepareCounterProxy() {
      const handler = {
        set: (currentContext, propertyKey, newValue) => {
          console.log(currentContext, propertyKey, newValue);

          //para parar todo o processamento
          if (!currentContext.value) currentContext.stop();

          currentContext[propertyKey] = newValue;
          return true;
        },
      };

      const counter = new Proxy(
        {
          value: VALUE_COUNT,
          stop: () => {},
        },
        handler
      );

      return counter;
    }

    refreshText = ({ elementCounter, counter }) => () => {
      const identifierText = '$$contador';
      const patternText = `Começando em <strong>${identifierText} segundos...</strong>`;

      elementCounter.innerHTML = patternText.replace(
        identifierText,
        counter.value--
      );
    };

    scheduleStopCounter({ elementCounter, idInterval }) {
      return () => {
        clearInterval(idInterval);
        elementCounter.innerHTML = '';

        this.disableButton(false);
      };
    }

    prepareButton(elementButton, startFn) {
      elementButton.addEventListener('click', startFn.bind(this));

      return (value = true) => {
        const attribute = 'disabled';

        if (value) {
          elementButton.setAttribute(attribute, true);
          return;
        }

        elementButton.removeAttribute(attribute);
      };
    }

    initialize() {
      const elementCounter = document.getElementById(ID_CONTADOR);
      const counter = this.prepareCounterProxy();
      const args = {
        elementCounter,
        counter,
      };

      const fn = this.refreshText(args);
      const idInterval = setInterval(fn, INTERVAL);

      {
        const elementButton = document.getElementById(BTN_RESTART);
        const disableButton = this.prepareButton(
          elementButton,
          this.initialize
        );
        disableButton();

        const args = {
          elementCounter,
          idInterval,
        };
        // const disableButton = () => console.log('disabled...');
        const stopCounterFn = this.scheduleStopCounter.apply(
          { disableButton },
          [args]
        );
        counter.stop = stopCounterFn;
      }
    }
  }

  window.CounterComponent = CounterComponent;
})();
