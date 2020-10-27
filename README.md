# Gabro Builder
This is simple app for building websites using Gabro Framework
## ⬇️ Please read this ⬇️
Please keep in mind that, this app is in **super early development**
## How to install
### Before install
Please make sure, you have [git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) installed. 
### Installation
#### Windows
Download latest *Gabro.Builder.Setup.exe* in [releases](https://github.com/JanSkvaril/Gabro-Builder/releases/). This will install latest version using [Squirrel](https://github.com/Squirrel/Squirrel.Windows).
#### Linux
TODO
## How this works
This app creates folder with real web project (using React and [Gabro Framework](https://github.com/JanSkvaril/Gabro-Framework) - but you don't need any experience with these) and provides you UI for editing it. When you **Create** project, it downloads template from github.com. Then, every time you **Open** this project, it will open preview of your website in browser that updates every time you make a change. When you click **Build** your project, builder will generate folder containg your website (html, css and js) that you can upload to your hosting.
## How to use
1. **Create** new project or **Open** existing one.
2. New tab with build preview should open in your browser. Or you can go to *http://localhost:3005/*
3. Every time you make a change, your build is saved in *Gabro-Build.json* file in project directory and preview should reload
### Components
Click *Add component* and choose component you want to add. In **Content** part of the new component you can add more components - some components can only be in some specific components. For example *Half* can only be in *Section*. 
* You can change component type by clicking *Change to* and choosing new component. **This will remove all props on current component!** 
### Props - Properties
For each component you can add and change properties. To do that click on *Add prop* and select new prop. Some props are required and will be added automatically. Props have different types - text, color, filePath, bg (background),...
* You can't remove required props
* All files **must** be in **src** folder in your project
* Background - if you want to set it to only one color, switch both colors in gradient to same color. 
* Background - if you want to set only background image (without color) set both colors to fully transparent (A - 0)