const fs=require('fs');
const content=fs.readFileSync('app/page.tsx','utf8');
const lines=content.split('\n');
const header=lines.slice(0,44);
const jsxLines=lines.slice(448);
const newLines=[...header,'','  return (','    <>','      <div className=home-body>','',...jsxLines];
fs.writeFileSync('app/page.tsx',newLines.join('\n'),{encoding:'utf8'});
console.log('Done. Lines:',newLines.length);
