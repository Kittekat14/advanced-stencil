import { h, Component } from '@stencil/core';

@Component({
  tag: 'fdk-spinner',
  styleUrl: './my-spinner.css',
  shadow: true,
})
export class MySpinner {
  render() {
    return (
      <div class="lds-circle">
        <div></div>
      </div>
    );
  }
}
