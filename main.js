const {app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
//const Squirrel = require('electron-squirrel-startup');


//--- read config file
const { remote } = require('electron');
const { dialog } = require('electron');
const fs = require("node:fs");
var config = {}; 
/*
// run this as early in the main process as possible
if(Squirrel) {
    app.quit();
};
*/

//create the main window
const createWindow = async() => {
    const mainWin = new BrowserWindow({
        width: 1200,
        height: 600,
        backgroundColor: "#ffffff",
        autoHideMenuBar: true,
        //icon: `file://${__dirname}/public/images/logo.png`
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        },
        
    });

    mainWin.loadFile("./views/index.html");
}

app.whenReady().then(async() => {
    await createWindow();
   
   /*
    let config2 = path.join(__dirname ,'/assets');
    let pa = path.join(__dirname , '..', '/assets');

    //copy the folder
    fs.cpSync(config2, pa, {recursive: true}, (err) => {
        if (err) throw err;
        console.log('Successfully moved the file!');
    });

    //remove folder after copying it
    fs.rm(config2, { recursive: true, force: true }, (err) => {
        if (err) {
        throw err;
        }
        console.log(`${config2} is deleted!`);
        });
    */

    //let imagesPath = path.join(__dirname , ".." , '/assets/');
    let imagesPath = path.join(__dirname , '/assets/');
    
    if(fs.existsSync(imagesPath)){
        ipcMain.handle('files', () => imagesPath)
    } else {
        console.log('The directory does NOT exist images');
    }

    //--- FILES NEED TO BE A LEVER UP FROM THE ROOT FOLDER

    //read config file
    // let config = path.join(__dirname , ".." , '/config.json');
    let config = path.join(__dirname , '/config.json');
    console.log(config)
    fs.readFile(config, 'utf-8', (err, data) => {
        if(err){
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }
        //send the data to the renderer - DOM
        config = data;
        ipcMain.handle('config', () => config)
    });
    
    

    //background video
    let bgPath = path.join(__dirname ,'/bg/');
    
    if(fs.existsSync(bgPath)){
        ipcMain.handle('bgpath', () => bgPath)
    } else {
        console.log('The directory does NOT exist bg');
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
    })


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})



//--- npm run start