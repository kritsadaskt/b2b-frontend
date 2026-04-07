import { publicAssetPath } from '../utils/assets';

/**
 * DBHeavent @font-face rules with correct prefix when `NEXT_PUBLIC_BASE_PATH` / basePath is set.
 */
export default function FontFaceStyles() {
  const u = (file: string) => publicAssetPath(`fonts/${file}`);

  const css = `
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Thin.woff')}') format('woff'),
       url('${u('DBHeavent-Thin.woff2')}') format('woff2');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Thin-It.woff')}') format('woff'),
       url('${u('DBHeavent-Thin-it.woff2')}') format('woff2');
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Light.woff')}') format('woff'),
       url('${u('DBHeavent-Light.woff2')}') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Light-It.woff')}') format('woff'),
       url('${u('DBHeavent-Light-It.woff2')}') format('woff2');
  font-weight: 300;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent.woff2')}') format('woff2'),
       url('${u('DBHeavent.woff')}') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Med.woff')}') format('woff'),
       url('${u('DBHeavent-Med.woff2')}') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Med-It.woff')}') format('woff'),
       url('${u('DBHeavent-Med-It.woff2')}') format('woff2');
  font-weight: 500;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Bold.woff2')}') format('woff2'),
       url('${u('DBHeavent-Bold.woff')}') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Bold-It.woff')}') format('woff'),
       url('${u('DBHeavent-Bold-It.woff2')}') format('woff2');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Black.woff2')}') format('woff2'),
       url('${u('DBHeavent-Black.woff')}') format('woff');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'DBHeavent';
  src: url('${u('DBHeavent-Black-It.woff')}') format('woff'),
       url('${u('DBHeavent-Black-It.woff2')}') format('woff2');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}
`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
