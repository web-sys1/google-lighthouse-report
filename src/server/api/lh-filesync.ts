import fs from 'fs'
import path from 'path'

export async function OutreachReport(result: any): Promise<void> {
    const reportPath = path.join(__dirname, '..', '..', '..', 'dist', 'statics', 'lh-report', 'lhreport.html')	  
    await fs.writeFile(reportPath, result, function(err: any) {
      if (err) {
        }  
       console.log('For full report, see', path.resolve(reportPath))		  

   });
  }