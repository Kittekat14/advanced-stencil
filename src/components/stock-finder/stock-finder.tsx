import { Component, Event, EventEmitter, State, h } from '@stencil/core';
import { MY_ALPHA_VANTAGE_API_KEY } from '../../globals';

@Component({
  tag: 'fdk-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: { symbol: string; name: string }[] = [];
  @State() loading: boolean = false;

  // "Custom Event", that can be listened to in the index.html in a script as
  // stockFinderEl.addEventListener('fdkSymbolSelected', () => {
  // ...
  // })
  // on the host element
  @Event({ bubbles: true, composed: true }) fdkSymbolSelected: EventEmitter<string>;

  onFindStocks(e: Event) {
    e.preventDefault();

    this.loading = true;

    const stockName = this.stockNameInput.value;

    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${MY_ALPHA_VANTAGE_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        this.searchResults = parsedRes['bestMatches'].map(result => {
          return { symbol: result['1. symbol'], name: result['2. name'] };
        });
        this.loading = false;
      })
      .catch(error => {
        console.error(error.message);
        this.loading = false;
      });
  }

  onSelectSymbol(symbol: string) {
    this.fdkSymbolSelected.emit(symbol);
  }

  render() {
    let content = (
      <ul>
        {...this.searchResults.map(result => (
          <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
            <strong>{result.symbol}</strong> - {result.name}
          </li>
        ))}
      </ul>
    );

    if (this.loading) {
      content = <fdk-spinner />;
    }

    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input
          id="stock-symbol"
          ref={el => {
            this.stockNameInput = el;
          }}
        />
        <button type="submit">Find!</button>
      </form>,
      content,
    ];
  }
}
