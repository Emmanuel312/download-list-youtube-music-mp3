const { writeFile,appendFile } = require('fs')
const { eachLine } = require('line-reader')
const { resolve } = require('path')


async function cleanFile(cb)
{
    console.log('clean')
    const file = resolve(__dirname,'..','youtube.txt')
    const fileFailed = resolve(__dirname,'failed.txt')
    const urlsFailed = []
    const youtubeList = []    

    eachLine(fileFailed, (line,last) =>
    {
        urlsFailed.push(Number(line))
     
    })
    
    eachLine(file, (line,last) =>
    {
        youtubeList.push(line)
        if(last)
        {
            for(let i = 0; i < youtubeList.length; i ++)
            {
                
                if(urlsFailed.indexOf(i) !== -1)
                {
                    if(i === urlsFailed[0])
                        writeFile(resolve(__dirname,'..','youtube.txt'),`${youtubeList[i]}\n`,err => err?  console.log(err): null)
                    else
                        appendFile(resolve(__dirname,'..','youtube.txt'),`${youtubeList[i]}\n`,err => err?  console.log(err): null)
                }
            }
            cb()
        }
    })
    
}

module.exports = cleanFile