const Koa = require('koa')
const Router = require('@koa/router')
const views = require('koa-views')
const serve = require('koa-static')
const path = require('path')

const app = new Koa()
const router = new Router()

const host = 3034

app.use(serve(path.join(__dirname, '../dist')))
app.use(views(path.join(__dirname, '../dist')))

router.get('/', async (ctx) => {
	await ctx.render('index.html')
})

/*
router.get('/api/nwPath', async (ctx) => {
	var path = require('path')
	nwPath = path.join(process.execPath)
	ctx.body = nwPath
})
*/

router.get('/api/connect-puppeteer', async (ctx) => {
	const util = require('util');
	const request = require('request');
	const puppeteer = require('puppeteer-core')
	const lighthouse = require('lighthouse')
	var execPath = process.execPath;
	var nwPath = path.join(execPath);
	const chromiumModule = await puppeteer.launch({headless:true, executablePath: nwPath});
        const remoteDebugPort = new URL(chromiumModule.wsEndpoint()).port;
	const resp = await util.promisify(request)(`http://localhost:${remoteDebugPort}/json/version`);
	const webSocketDebuggerUrl = JSON.parse(resp.body);
	try {
	        ctx.body = webSocketDebuggerUrl;
	} catch (err) {
		ctx.body = "Error occured:" || err.message 
	}
})


router.get('/api/report', async (ctx) => {
    const puppeteer = require('puppeteer-core')
    const path = require('path')
    var nwPath = path.join(process.execPath)
    const lighthouse = require('lighthouse')
    const url = ctx.query.url
	
    const chromiumModule = await puppeteer.launch({headless:true, executablePath: nwPath});
    const remoteDebugPort = new URL(chromiumModule.wsEndpoint()).port;
	
    const flags = {
	output: 'json',
	logLevel: 'info',
	port: remoteDebugPort,
	screenEmulation: {
           mobile: false,
           disabled: true,
        },
        formFactor: 'desktop',
	throttling: { 
           cpuSlowdownMultiplier: 0
	 },
	chromeFlags: [
		"--disable-gpu",
	        "--no-sandbox",
	  ]
	}
    
// todo: custom config
     const config = {
	  extends: "lighthouse:default"
	}
	try {
	  const result = await lighthouse(url, flags, config)
	  ctx.type = 'application/json; charset=utf-8'
	  ctx.body = result.lhr
	  await chromiumModule.disconnect()
	  await chromiumModule.close()

	}
	catch (err) {
		ctx.status = 400
		ctx.type = 'text/plain; charset=utf-8'
		ctx.body = err.friendlyMessage || err.message || err.code || `${err}`
		await chromiumModule.close()
	}
})

app.use(router.routes())
app.listen(host, () => {
	console.log('start on host: ', host)
})
