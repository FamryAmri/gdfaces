const Jimp = require('jimp')
const express = require('express')
const config = require('./config')

const app = express()

const basic = ["images/unrated.png", "images/auto.png", "images/easy.png", "images/normal.png", "images/hard.png", "images/harder.png", "images/insane.png"];
const demon = ["images/demon-easy.png", "images/demon-medium.png", "images/demon-hard.png", "images/demon-insane.png", "images/demon-extreme.png"];
const special = ["images/featured.png", "images/epic.png", "images/null.png"];
const code = {
    actual: {
        "na": 0,
        "auto": 1,
        "easy": 2,
        "normal": 3,
        "hard": 4,
        "harder": 5,
        "insane": 6,
        "demon": {
            "easy": 1,
            "medium": 2,
            "hard": 3,
            "insane": 4,
            "extreme": 5
        },
        "special": {
            "featured": 0,
            "epic": 1,
            "default": 2
        }
    },
    basic: [0, 1, 2, 3, 4, 5, 6],
    demon: [2, 0, 1, 2, 3, 4],
}

var whichsp = (ifo=null) => {
    if (ifo == 'featured' || ifo == 'f'){
        return 0;
    } else if (ifo == 'epic' || ifo == 'e') {
        return 1;
    } else {
        return 2;
    }
}

var mix = async (ifo, diff) => { // mixing image
    var sp = special[whichsp(ifo)];
    var lenb = code['basic'].length
    var difff = ''

    difff = basic[code['basic'][diff]]
    if (diff >= lenb) difff = demon[code['demon'][diff-lenb]] || basic[0]

    var glow = await Jimp.read(sp);
    var diff = await Jimp.read(difff);

    var isdemon = false;
    if (difff.split('/')[1].split('-')[0] == 'demon') isdemon = true;

    if (whichsp(ifo)==0) {
        if (!isdemon) {
            glow.composite(diff.resize (230, 230), 36, 37)
        } else {
            glow.composite (diff.resize (255,230), 24, 35);
        }
    } else if (whichsp(ifo)==1){
        if (!isdemon) {
            glow.composite (diff.resize (201, 201), 48, 64);
		} else {
			glow.composite (diff.resize (226, 201), 36, 64);
		}
    } else {
        return diff
    }

    return glow;
}

var finddiff = (arrdef=[]) => { // handle finder (it's not will catch error ig)
    let arr = arrdef[0].split('-')

    let first = code.actual[arr[0]] || 0
    if (isNaN(first)) return (first[arr[1]] || 3) + code['basic'].length
    return first;
}

app.get('*', async (req, res) => {
    let url = req.url.split('/')[1].split(',') || []

    let diff = url[0] || 0
    if (isNaN(url[0])) diff = finddiff(url)

    let spc = url[1] || null

    console.log(`${diff},${spc}`)

    image = await mix (spc, diff);
    image.getBuffer (Jimp.AUTO, (err, buffer)=>{
        res.writeHead(200);
        res.write(buffer);
        res.end()
    })
});

var whichport = process.env.PORT || config.port
app.listen(whichport, console.log('Running in port: ' + whichport))