import { h, Component, State, Element, Listen, Prop, Watch, Host } from '@stencil/core';
import { MY_ALPHA_VANTAGE_API_KEY } from '../../globals';

@Component({
  tag: 'fdk-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  // using references instead of @Element()
  stockInput: HTMLInputElement;
  @Element() stockPriceElement: HTMLElement;

  @State() fetchedPrice: number;
  @State() userInput: string;
  @State() userInputValid: boolean;
  @State() errorMessage: string;
  @State() loading: boolean;

  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.userInput = newValue;
      this.userInputValid = true;
      this.fetchStockPrice(newValue);
    }
  }

  // listen to ANY EMITTED EVENTS, also Custom Events!
  @Listen('fdkSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockInput) {
      this.stockSymbol = event.detail;
    }
  }

  componentWillLoad() {
    if (this.stockSymbol) {
      this.userInput = this.stockSymbol;
      this.userInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    this.stockSymbol = this.stockInput.value;

    // const stockSymbol = (this.stockPriceElement.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    // accessing the value of that referenced element by ref={(el) => ...} in the element
    // which you want to grab from the DOM and is included in Stencil:
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${MY_ALPHA_VANTAGE_API_KEY}`)
      .then(response => {
        return response.json();
      })
      .then(parsedRes => {
        if (parsedRes['Information']) {
          throw new Error(parsedRes['Information']);
        } else if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid Stock Symbol!');
        }

        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
        this.errorMessage = null;
        this.loading = false;
      })
      .catch(error => {
        this.errorMessage = error.message;
        this.fetchedPrice = null;
        this.loading = false;
      });
  }

  onUserInput(e: Event) {
    this.userInput = (e.target as HTMLInputElement).value;

    if (this.userInput.trim() !== '') {
      this.userInputValid = true;
    } else {
      this.userInputValid = false;
    }
  }

  render() {
    let content = <p>Please enter a stock symbol!</p>;

    if (this.errorMessage) {
      content = <p>{this.errorMessage}</p>;
    }

    if (this.fetchedPrice) {
      content = <p>Price: $ {this.fetchedPrice}</p>;
    }

    if (this.loading) {
      content = <fdk-spinner></fdk-spinner>;
    }

    return (
      <Host
        class={{
          error: this.errorMessage ? true : false,
        }}
        style={{ background: 'lightyellow' }}
      >
        <form onSubmit={this.onFetchStockPrice.bind(this)}>
          <input
            id="stock-symbol"
            ref={el => {
              this.stockInput = el;
            }}
            value={this.userInput}
            onInput={this.onUserInput.bind(this)}
          />
          <button type="submit" disabled={!this.userInputValid || this.loading}>
            Fetch
          </button>
        </form>
        <div>{content}</div>
      </Host>
    );
  }
}
