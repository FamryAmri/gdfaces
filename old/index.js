const Jimp = require ("jimp");
const express = require ("express");
const config = require ("./config.js");
const app = express ();

const basic = ["images/unrated.png", "images/auto.png", "images/easy.png", "images/normal.png", "images/hard.png", "images/harder.png", "images/insane.png"];
const demon = ["images/demon-easy.png", "images/demon-medium.png", "images/demon-hard.png", "images/demon-insane.png", "images/demon-extreme.png"];
const special = ["images/featured.png", "images/epic.png", "images/null.png"];
	
app.get ("*", (req, res) => {
	let url = req.url.split ("/");
	
	let type;
	
	switch (url[1]){
		case "demon":
		switch (url[2]){
			case "easy":
			type = demon[0];
			break;
			case "medium":
			type = demon[1];
			break;
			case "hard":
			type = demon[2];
			break;
			case "insane":
			type = demon[3];
			break;
			case "extreme":
			type = demon[4];
			break;
			default:
			type = basic[0];
			break;
			}
		break;
		case "basic":
		switch (url[2]){
			case "easy":
			type = basic[2];
			break;
			case "normal":
			type = basic[3];
			break;
			case "hard":
			type = basic[4];
			break;
			case "harder": 
			type = basic[5];
			break;
			case "insane":
			type = basic[6];
			break;
			case "auto":
			type = basic[1];
			break;
			default:
			type = basic[0];
			break;
			}
		break;
                default:
                type = basic[0];
                break;
		}
		switch (url[3]){
			case "featured":
			i = 0;
			break;
			case "epic":
			i = 1;
			break;
			default:
			i = 2;
			break;
			}
	Jimp.read (special[i]).then (async (glow) => {
		Jimp.read (type).then (async (diff) => {
			if (special[i].split ("/")[1] == "featured.png"){
				if (type.split ("/")[1].split("-")[0] !== "demon"){
					glow.composite (diff.resize (230, 230), 36, 37);
					} else {
						glow.composite (diff.resize (255,230), 24, 35);
						}
				} else {
					if (type.split ("/")[1].split ("-")[0] !== "demon"){
						glow.composite (diff.resize (201, 201), 48, 64);
						} else {
							glow.composite (diff.resize (226, 201), 36, 64);
							}
					}
					glow.getBuffer(Jimp.AUTO, (err, buff) => {
						res.writeHead (200);
						res.write (buff);
						res.end ();
					});
				});
			});
		});
			
app.listen (process.env.PORT || config.port, console.log ("Running on port " + config.port));
