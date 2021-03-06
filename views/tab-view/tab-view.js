/**
 * @author : Malik Fleury, Bulloni Lucas
 * @description : Class to display a tabbed view
 */
let AbstractView = require('../../abstract-view-class.js');
const {session} = require('electron');
const Tab = require('./tab.js');
const FilesHistory = require('../../files-history.js');

class TabView extends AbstractView
{
  constructor(element)
  {
    super(element);
    this.ulTabs = undefined;
    this.divsContent = undefined;
    this.focusedTab = undefined;
  }

  createTab(project)
  {
    let tab = new Tab(this.ulTabs, this.divsContent, project);
    tab.display();

    TabView.listTabs.push(tab);

    $('#' + tab.getIdTab()).click(() => {
      this.focusedTab = tab;
      console.log(this.focusedTab);
      makeActive(tab);
    });

    $(`#${tab.getIdTab()} i`).click(() => {
      closeTab(tab);
      event.stopPropagation();
    });

    if(project.fileName !== undefined)
    {
      FilesHistory.getInstance().addTab(project.fileName);
    }

    $('#'+tab.getIdTab()).click();
  }

  getFocusedTab()
  {
    return this.focusedTab;
  }

  // add the html to the dom
  display()
  {
    $(this.element).html(`
      <link rel="stylesheet" href="views/tab-view/tab-view.css">
      <link rel="stylesheet" href="views/tab-content/tab-content.css">
      <link rel="stylesheet" href="views/list-tasks/list-tasks.css">
      <link rel="stylesheet" href="views/diagram-view/diagram-view.css">

      <ul id="tabs">
      </ul>
      <div id="tab-content"></div>
    `);

    this.ulTabs = document.getElementById('tabs');
    this.divsContent = document.getElementById('tab-content');

    //adapt the height of the div to the full width
    $(window).resize(function()
    {
      $('#tab-content').height($('#tab-content').parent().height() - $('#tabs').height());
    });

    $(document).ready(function()
    {
      $(window).trigger('resize');
    });
  }

  static getInstance()
  {
    if(TabView.instance == undefined)
    {
      TabView.instance = new TabView($('#content-container'));
    }

    return TabView.instance;
  }
}

TabView.listTabs = [];
TabView.instance = undefined;

const ACTIVE_TAB_CLASS = ' active-tab';
const ACTIVE_CONTENT_CLASS = ' active-content';

//make the active tab
function makeActive(tab)
{
  for (i = 0; i < TabView.listTabs.length; i++)
  {
    let tabElement = document.getElementById(TabView.listTabs[i].getIdTab());
    tabElement.className = tabElement.className.replace(ACTIVE_TAB_CLASS, '');

    let content = document.getElementById(TabView.listTabs[i].getIdContent());
    content.className = content.className.replace(ACTIVE_CONTENT_CLASS, '');
  }

  document.getElementById(tab.getIdTab()).className += ACTIVE_TAB_CLASS;
  document.getElementById(tab.getIdContent()).className += ACTIVE_CONTENT_CLASS;
}

function closeTab(tab)
{
  let iTab = TabView.listTabs.indexOf(tab)
  TabView.listTabs.splice(iTab, 1);

  $(`#${tab.getIdTab()}`).remove();
  $(`#${tab.getIdContent()}`).remove();

  if(tab.project.fileName !== undefined)
  {
    FilesHistory.getInstance().removeTab(tab.project.fileName);
  }

  if(TabView.listTabs.length <= 0)
  {
    let Home = require('../../views/home/home.js');
    let home = new Home($('#content-container'));

    TabView.instance = undefined;
    home.display();
  }
  else
  {
    if(iTab == TabView.listTabs.length)
    {
      iTab--;
    }

    $('#' + TabView.listTabs[iTab].getIdTab()).click();
  }
}

module.exports = TabView;
