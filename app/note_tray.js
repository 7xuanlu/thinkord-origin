const electron = require('electron');
const { app, Tray, Menu } = electron;

class NoteTray extends Tray {
    constructor(iconPath, controlWindow) {
        super(iconPath); // Super class's constructor
        
        this.controlWindow = controlWindow;
        this.setToolTip('Note');
        this.on('click', this.onClick.bind(this));
        this.on('right-click', this.onRightClick.bind(this));
    }

    onClick(events, bounds) {
        // Click event bounds
        const { x, y } = bounds;

        // Window height and width
        const { height, width } = this.controlWindow.getBounds();

        if (this.controlWindow.isVisible()) {
            this.controlWindow.hide();
        } else {
            const yPosition = process.platform === 'darwin' ? y : y-height;
            this.controlWindow.setBounds({
                x: Math.round(x - width / 2),
                y: yPosition,
                height: height,
                width: width
            })
            this.controlWindow.show();
        } 
    }

    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ]);

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = NoteTray;