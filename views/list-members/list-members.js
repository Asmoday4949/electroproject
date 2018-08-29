// Imports
let AbstractView = require('../../abstract-view-class.js');
let {Project, Task, Member} = require('../../data/project.js');
<<<<<<< HEAD
let Modal = require('../modal/modal-class.js')
=======
let SerializerTool = require('../../tools/serializertool.js');
>>>>>>> team-manager

class ListMembers extends AbstractView
{
  constructor(element, project)
  {
    super(element);
    this.project = project;
    this.project.team = SerializerTool.unserializeFromFile("./team.epd");  // Tests
  }

  display()
  {
    let htmlText = `
    <link rel="stylesheet" type="text/css" href="./views/list-members/list-members.css">

    <table id="tbl_members" class="table table-hover">
      <col id="tbl_column_color">
      <col id="tbl_column_name">
      <col id="tbl_column_Controls">
      <thead>
        <tr>
          <th scope="col">Color</th>
          <th scope="col">Name</th>
          <th scope="col">Controls</th>
        </tr>
      </thead>
      <tbody>
        ${this.getHTMLList()}
      </tbody>
    </table>

    <div class="btn-team-edition" class="btn-group" role="group">
      <button type="button" id="${this.project.name.toLowerCase()}-add-member" class="btn btn-primary"><i class="fas fa-plus"></i> Add a member</button>
    </div>
    `;

    $(this.element).html(htmlText);
    this.addEvent();
  }

  addHTMLRowMember(member)
  {
    let htmlText = `
    <tr>
      <td bgcolor="` + member.color + `"></td>
      <td>` + member.name + `</td>
      <td>
        <button class="btn btn-link btn-modify-member" data-task-id=""><i class="fas fa-edit" data-task=""></i></button>
        <button class="btn btn-link btn-remove-member" data-task-id=""><i class="fas fa-trash" data-task=""></i></button>
      </td>
    </tr>`;

    return htmlText;
  }

  getHTMLList()
  {
    let htmlText = ``;

    for(let i = 0;i < this.project.team.length; i++)
    {
      let member = this.project.team[i];
      htmlText += this.addHTMLRowMember(member);
    }

    return htmlText;
  }

  addEvent()
  {
    let project = this.project;
    let listMembers = this;

    let addMemberClickEvent = function(event)
    {
      let ConfirmModal = require('../confirm-modal/confirm-modal.js');

      ConfirmModal.show('Add member', listMembers.getHTMLFormFunc("#345321", "coco"), function() { listMembers.addMemberConfirm(); });
    };

    $(`#${this.project.name.toLowerCase()}-add-member`).click(addMemberClickEvent);

    let modifyMemberClickEvent = function(event)
    {
      let ConfirmModal = require('../confirm-modal/confirm-modal.js');
      let index = $(this).closest("tr").index();
      let member = project.team[index];

      ConfirmModal.show('Modify member', listMembers.getHTMLFormFunc(member.color, member.name), function() { listMembers.modifyMemberConfirm(member); });
    };

    $(`.btn-modify-member`).click(modifyMemberClickEvent);

    let removeMemberClickEvent = function(event)
    {
      let ConfirmModal = require('../confirm-modal/confirm-modal.js');
      let index = $(this).closest("tr").index();

      ConfirmModal.show('Modify member', listMembers.getHTMLRemoveMemberWarningMessage(), function() { listMembers.removeMemberConfirm(index); });
    };

    $(`.btn-remove-member`).click(removeMemberClickEvent);
  }

  addMemberConfirm()
  {
    let color = $('#cp_member_color').val();
    let name = $('#txt_member_name').val();

    let member = new Member();
    member.color = color;
    member.name = name;
    this.project.team.push(member);

    this.display();
  }

  modifyMemberConfirm(member)
  {
    let color = $('#cp_member_color').val();
    let name = $('#txt_member_name').val();

    member.color = color;
    member.name = name;

    this.display();
  }

  removeMemberConfirm(index)
  {
    this.project.team.splice(index, 1);

    this.display();
  }

  getHTMLFormFunc(color, name)
  {
    let htmlText = `
    <label for="color_picker">Color</label>
    <input type="color" id="cp_member_color" value="` + color + `" name="textcolor"></input>
    <br>
    <label for="txt_name">Name</label>
    <input type="text" id="txt_member_name" name="name" value="` + name + `"></input><br>
    `;

    return htmlText;
  }

  getHTMLRemoveMemberWarningMessage()
  {
    return 'Are you sure to remove this member ?';
  }
}

module.exports = ListMembers;
