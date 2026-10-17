const fs=require('fs'),path=require('path');let ts;
// Prefer the project's declared dependency; support global and bundled Node layouts too.
for(const modulePath of ['typescript',path.resolve(path.dirname(process.execPath),'../lib/node_modules/typescript'),path.resolve(path.dirname(process.execPath),'../node_modules/typescript')]){
 try{ts=require(modulePath);break}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error}
}
if(!ts)throw new Error('TypeScript is required to build. Run npm install in the project directory first.');
const r=path.resolve(__dirname,'..'),files=fs.readdirSync(path.join(r,'src')).filter(f=>f.endsWith('.jsx')).sort();
const raw=files.map(f=>`\n/* ${f} */\n`+fs.readFileSync(path.join(r,'src',f),'utf8')).join('\n');
const o=ts.transpileModule(raw,{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2019,module:ts.ModuleKind.None},reportDiagnostics:true,fileName:'boardroom.jsx'});
const errors=(o.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);if(errors.length){console.error(errors.map(e=>ts.flattenDiagnosticMessageText(e.messageText,'\n')));process.exit(1)}
const correctedDir=path.join(r,'public/media/corrected');
const mediaCorrections=Object.fromEntries((fs.existsSync(correctedDir)?fs.readdirSync(correctedDir):[]).filter(f=>/^(figure-\d{2}-\d{2}|page-\d{2})\.webp$/.test(f)).sort().map(f=>[f,'corrected/'+f]));
fs.writeFileSync(path.join(r,'public/app.js'),'/* Famili Farda: local React presentation app. */\nwindow.FAMILI_MEDIA_CORRECTIONS='+JSON.stringify(mediaCorrections)+';\n(function(){"use strict";\n'+o.outputText+'\n})();');
fs.writeFileSync(path.join(r,'public/app.css'),['style.css','cinematic.css','brand.css','motion.css','navigation.css'].filter(f=>fs.existsSync(path.join(r,'src',f))).map(f=>'/* '+f+' */\n'+fs.readFileSync(path.join(r,'src',f),'utf8')).join('\n'));
const h='<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#02b1c5"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>فامیلی فردا | اتاق ارائه هیئت‌مدیره</title><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="app.css"></head><body><div id="root"><div style="padding:90px 25px;text-align:center;font-family:Tahoma,sans-serif;color:#075763"><h1>فامیلی فردا</h1><p>در حال آماده‌سازی اتاق ارائه…</p></div></div><noscript>JavaScript باید فعال باشد. متن اصلی پژوهش در پوشه knowledge است.</noscript><script src="vendor/react.min.js"></script><script src="vendor/react-dom.min.js"></script><script src="catalog.js"></script><script src="app.js"></script></body></html>';
for(let f of ['index.html','START-HERE.html'])fs.writeFileSync(path.join(r,'public',f),h);
const logo=fs.readFileSync(path.join(r,'public/media/brand-logo.png')).toString('base64');
fs.writeFileSync(path.join(r,'public/favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 103"><image width="300" height="103" href="data:image/png;base64,'+logo+'"/></svg>');console.log('Build OK:',files.join(', '),o.outputText.length,'characters');
