# Gabro Builder
This is simple app for building websites using Gabro Framework
## ⬇️ Please read this ⬇️
Please keep in mind that, this app is in **super early development**
## How to install
TODO
## How this works
This app creates folder with real web project (using React and (Gabro Framework)[https://github.com/JanSkvaril/Gabro-Framework] - but you don't need any experience with these) and provides you UI for editing it. When you **Create** project, it downloads template from github.com. Then, every time you **Open** this project, it will open preview of your website in browser that updates every time you make a change. When you click **Build** your project, builder will generate folder containg your website (html, css and js) that you can upload to your hosting.
## How to use
### Components
Click *Add component* and choose component you want to add. In **Content** part of the new component you can add more components - some components can only be in some specific components. For example *Half* can only be in *Section*. 
* You can't remove required components
* You can change component type by clicking *Change to* and choosing new component. **This will remove all props on current component!** 
### Props - Properties
For each component you can add and change properties. To do that click on *Add prop* and select new prop. Some props are required and will be added automatically. Props have different types - text, color, filePath, bg (background),...
* All files **must** be in **src** folder in your project
* Background - if you want to set it to only one color, switch both colors in gradient to same color. 
* Background - if you want to set only background image (without color) set both colors to fully transparent (A - 0)