const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { channel } = require('diagnostics_channel');


const app = express();

async function buildMosaic(inputPath, cellSize){
    const meta = await sharp(inputPath).metadata();
    const { width, height } = meta;

    const { data, info } = await sharp(inputPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true});

    const channels = info.channels;
    const outData = Buffer.alloc(width*height* channels);

    for( let cellY = 0;cellY < Math.ceil(height/cellSize);cellY++){
         for( let cellX = 0;cellX < Math.ceil(width/cellSize);cellX++){
            const xStart = cellX * cellSize;
            const yStart = cellY * cellSize;
            const xEnd = Math.min(xStart + cellSize,width);
            const yEnd = Math.min(yStart+ cellSize, height);

            let rSum = 0, gSum = 0, aSum = 0, bSum=0,count =0;

            for(let y = yStart; y<yEnd; y++){
                for(let x = xStart; x<xEnd;x++){
                    const idx = (y * width + x ) * channels;
                    rSum += data[idx];
                    gSum += data[idx+1];
                    bSum += data[idx+2];
                    aSum += data[idx+3];
                    count++;
                }
            }

           
            const rAvg = Math.round(rSum/count);
            const gAvg = Math.round(gSum/count);
            const bAvg = Math.round(bSum/count);
            const aAvg = Math.round(aSum/count);
            

            for(let y= yStart; y<yEnd; y++){
                for(let x= xStart; x<xEnd; x++){
                    const idx = ( y* width + x) * channels ;
                    outData[idx] = rAvg;
                    outData[idx+1] = gAvg;
                    outData[idx+2] = bAvg;
                    outData[idx+3] = aAvg;
                }
            }
         }
    }

    return sharp(outData, { raw: { width, height,channels}})
    .png()
    .toBuffer();
}

app.get('/mosaic', async (req,res) =>{
    try{
        const cellSize = parseInt(req.query.cell_size, 10) || 50;
        const filename = req.query.image || 'original.jpg';
        const imagePath = path.join(__dirname, 'resource', filename);

        if(!fs.existsSync(imagePath)){
            return res.status(404).json({ error: ' Image not found ${filename}'});
        }
        
        if(cellSize <1 ){
            return res.status(400).json({ error: ' cell size must be a positive integer'});
        }

        const mosaicBuffer = await buildMosaic(imagePath, cellSize);

        res.set('Content-Type', 'image/png');
        res.send(mosaicBuffer);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: err.message});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server runnning '));

module.exports = app;