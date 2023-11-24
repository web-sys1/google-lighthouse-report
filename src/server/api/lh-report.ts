import { Context } from 'koa';
import { OutreachReport } from './lh-filesync';

export async function GenerateReport(context: Context): Promise<void> {
  const fs = require('fs')
  const puppeteer = require('puppeteer-core');
  const path = require('path')
  const lighthouse = require('lighthouse');
  const url = context.query.url
  const lang = context.query.lang
  const {userAgents} = require('lighthouse/lighthouse-core/config/constants')
  var execPath = process.execPath;
  var nwPath = path.join(execPath);
  
  const sessionBrowser = await puppeteer.launch({
	          executablePath: nwPath, 
                  args: ['--headless',
	                 '--no-sandbox=true',
                         '--disable-setuid-sandbox',
			 '--disable-gpu',
			 '--disable-raf-throttling'
			]
		 });
				  
  const sessionPort = new URL(sessionBrowser.wsEndpoint()).port;

  const lr_flags = {
	output: 'html',
	logLevel: 'info',
	port: sessionPort,
	emulatedUserAgent: userAgents.desktop,
	screenEmulation: {
		deviceScaleRatio: 1,
		deviceScaleFactor: 1,
        mobile: false,
        disabled: false,
       },
        formFactor: 'desktop',
	locale: lang,
        throttling: { 
	    cpuSlowdownMultiplier: 0,
	    downloadThroughputKbps: 0,
	    rttMs: 40,
	    requestLatencyMs: -10,
            throughputKbps: 10240,
	    uploadThroughputKbps: 0
	   }
	}
   
  try {
	  const result = await lighthouse(url, lr_flags)
	  const lhResult = result.lhr

	  context.type = 'application/json'
	  context.body = JSON.stringify(lhResult, null, 4)

	  await OutreachReport(result.report); 
	} 
  catch (err) {
	  context.status = 400
          context.type = 'text/plain; charset=utf-8'
          console.log(`Error ${context.status}: ${err.message}`)
	  const errorMsg = {"lh_status": { "lh_error": [{"message": err,"code": err.code}],"response": context.status}}

	  context.body = JSON.stringify(errorMsg, null, 4)
	}
  finally {
	  console.log('Waiting for browser to shut down the session.')
          await sessionBrowser.disconnect()
	  await sessionBrowser.close()
	}
}
