import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';

// export const config: Config = {
//   namespace: 'UdemyWCCourse',
//   outputTargets: [
// third-party component library to be distributed on npm
//  with lazy-loaded components
// {
//   type: 'dist',
// },
// output target type is oriented for webapps and websites, hosted from an http server,
// which can benefit from prerendering and service workers, such as this very site you're reading
// { type: 'www', serviceWorker: null },
// ],
// The bundles config is an array of objects that represent how components are grouped together in lazy-loaded bundles.
// This config is rarely needed as Stencil handles this automatically behind the scenes.
// Goal: reduce network requests and save bundle size by code splitting in smaller chunks
// for use inside another App like Angular or React
// bundles: [
//   { components: ['ion-button'] },
//   { components: ['ion-card', 'ion-card-header'] }
// ]
// };

export const config: Config = {
  namespace: 'advanced-stencil',
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: 'advanced-stencil/dist', // it is tricky part
      directivesProxyFile: '../../Angular/wc-demo/projects/stencil-generated/project02-component.ts',
      //here is directory where Proxyfile will be generated in your local Angular environment
      directivesArrayFile: '../../Angular/wc-demo/projects/stencil-generated/project02-index.ts',
      //here is directory where Arrayfile will be generated in your local Angular environment
      // This is what tells the target to use the custom elements output
      outputType: 'standalone', // or 'scam',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      // customElementsExportBehavior: 'auto-define-custom-elements',
      // externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    // generates a full project to deploy on a host, if you use Stencil for your whole app, not only for components
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  // components, that are meant to be together, in one split-bundle, not all in one
  // => automatic code splitting, loading when required // Stencil does this intelligently on its own
  // bundles: [{ components: [] }],
  testing: {
    browserHeadless: 'new',
  },
};
