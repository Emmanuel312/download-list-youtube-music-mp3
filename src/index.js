const puppeteer = require('puppeteer')
const { appendFile, writeFile } = require('fs')
const { eachLine } = require('line-reader')
const { resolve } = require('path')
const { EventEmitter } = require('events')
const cleanFile = require('./failed/failed')


async function getLinkAndSave2mate(url)
{ 
        console.log(url)
    const browser = await puppeteer.launch({headless: true })
    const page = await browser.newPage()
    
    await page.goto(url)
    
    await page.waitForSelector('#process_mp3',  {visible: true})
    await page.evaluate(async () => await document.querySelector('#process_mp3').click())
    
    await page.waitForSelector('a[href^="http://"]',  {visible: true})
    await page.evaluate(async () => await  document.querySelector('a[href^="http://"]').click())
    
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: resolve(__dirname,'..','musics') })
}

function convertUrl2mate(url)
{
    //const urlFormatted = url.split(' ')[4]
    const [preffix,suffix] = urlFormatted.split('=')
    const y2mate = `https://www.y2mate.com/youtube-mp3/${suffix}`
    return y2mate
}



async function getLinkAndSave10convert(url)
{ 
    console.log(url)
    const browser = await puppeteer.launch({headless: true })
    const page = await browser.newPage()
    
    await page.goto(url)
    
    await page.waitForSelector('.btn.btn-danger.btn-sm',  {visible: true})

    await page.evaluate(async () => await document.querySelector('.btn.btn-danger.btn-sm').click())

    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: resolve(__dirname,'..','musics') })

}
function convertUrl10convert(url)
{
    const urlFormatted = url.split(' ')[4]
    const [preffix,suffix] = urlFormatted.split('=')
    const y2mate = `https://www.10convert.com/watch?v=${suffix}`
    return y2mate
}



async function readFile(cb)
{   
    const emitter = new EventEmitter()
    emitter.setMaxListeners(100)
    const links = []
    const file = resolve(__dirname,'youtube.txt')
    eachLine(file, async (url,last) =>
    {
        
        const converttedUrl = convertUrl2mate(url) 

        links.push(converttedUrl)

        if(last)
        {
            let first = true

            for (let i = 0; i < links.length;i++)
            {
                try
                {
                    await getLinkAndSave2mate(links[i])
                        
                }
                catch(err)
                {
                    console.log(err.message)
                    if(err.message === 'waiting for selector ".btn.btn-danger.btn-sm" failed: timeout 30000ms exceeded' || err.message === 'waiting for selector "#process_mp3" failed: timeout 30000ms exceeded' || err.message === 'waiting for selector "a[href^="http://"]" failed: timeout 30000ms exceeded')
                    {
                        if(first)
                        {
                            writeFile(resolve(__dirname,'failed','failed.txt'), `${i}\n`, err => err?  console.log(err): null)
                            first = false
                        }
                        else
                        {
                            appendFile(resolve(__dirname,'failed','failed.txt'), `${i}\n`, err => err?  console.log(err): null)
                        }
                    }
                    else
                        i -= 1
                    
                }
                
            }
            cb(recursionClean)
        }
    })
    
}

function recursionClean()
{
    const failedArray = []
    
     eachLine(resolve(__dirname,'failed','failed.txt'), (line,last) =>
    {

        failedArray.push(line)

        if(last)
        {
            if(failedArray.length > 0)
                index()
        }
    })
}


async function index()
{
    await readFile(cleanFile)
    
}

index()