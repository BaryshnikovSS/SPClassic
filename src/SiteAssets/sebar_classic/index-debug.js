class DepartmentsWP {
  constructor() {
    this.departmentsList;
    this.departmentsBodyId = "dprtBody";
    this.baseURL = `${_spPageContextInfo.webAbsoluteUrl}/`;
  }

  async getData() {
    //************* МОЙ КОД ТУТ :) *************

    try {
      const fields = ['Title', 'Task_x0020_description', 'Importance', 'Performed', 'Created', 'Modified'];
      const result = await this.getItems(fields);

      this.addDataToTable(result);
    } catch (err) {
      throw new Error(err);
    }

    //***************************************
  }

  async getItems(items = []) {
    try {
      if (items.length === 0) return;

      const select = items.join(", ");
      const query = this.getQuery('Tasks(exam)', `items?$select=${select}`);
      const request = await this.getAJAX(this.baseURL + query);

      return await request.d.results;
    } catch (err) {
      throw new Error(err);
    }
  }

  addDataToTable(data = []) {
    if (data.length === 0) return;

    const markup = data.reduce((acc, el) => {
      const {
        Title,
        Task_x0020_description,
        Importance,
        Performed,
        Created
      } = el;

      acc += `<tr>
          <td>${Title}</td>
          <td>${Task_x0020_description}</td>
          <td>${Importance}</td>
          <td>${Performed ? 'YES' : 'NO'}</td>
          <td>${Created}</td>
        </tr>`;

      return acc;
    }, "");

    $(function () {
      $(".table_blur").append(markup)
    });
  }

  async getFields(fields = []) {
    try {
      const filterByTitle = fields.reduce((acc, el, idx, arr) => {
        acc += `Title eq '${el}' `
        if (idx !== arr.length - 1) acc += 'or ';
        return acc;
      }, '');

      const query = fields.length !== 0 ? this.getQuery('Tasks(exam)', `fields?$filter=${filterByTitle}`) : this.getQuery('Tasks(exam)', `fields`);
      const request = await this.getAJAX(this.baseURL + query);

      const result = await request.d.results;
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  // createTask(data = {}) {
  //   try {
  //     // const query = this.getQuery('Team(exam)', 'fields.d.results[0].Choices.results');

  //     //   const query = this.getQuery('Team(exam)', 'items');
  //     //   const requestDigest = await this.getRequestDigest(url);
  //     //   console.log('requestDigest', requestDigest.d.GetContextWebInformation.FormDigestValue);
  //     //   const listItemType = await this.getListItemType(url, "Team(exam)");
  //     // // console.log('listItemType', listItemType);
  //     const newData = {
  //       Task: "newTask",
  //       Description: "",
  //       Performed: false,
  //       Importence: choices[0], //ввесь перечень чейсов можно получить, если вытянуть филды списка и посмотреть в свойстве Choise этого филда
  //       LeaderId: 2 // lookup поле приставка Id + записывает айдишник айтема списка, куда смотрит это поле. В нашем случае список контактов
  //     }; // формирует объект с изминениями

  //     Object.assign(newData, ...data)

  //     const createdData = await this.createData(

  //       this.baseURL + query, newData

  //       // url, 
  //       // fields.d.results[0].Choices.results
  //     );
  //     console.log(createdData);
  //   } catch (err) {
  //     console.log('err', err)
  //   }


  // }

  // async createData(url = "", newData = {}) {



  // const query = this.getQuery('Team(exam)', 'items');
  // const requestDigest = await this.getRequestDigest(url);
  // console.log('requestDigest', requestDigest.d.GetContextWebInformation.FormDigestValue);
  // const listItemType = await this.getListItemType(url, "Team(exam)");
  // // console.log('listItemType', listItemType);

  //   const objType = {
  //     __metadata: {
  //       type: listItemType.d.ListItemEntityTypeFullName,
  //     }
  //   };

  //   const objData = JSON.stringify(Object.assign(objType, newData));
  //   return this.postAJAX(query, objData)
  // }

  async createTask(newUser) {
    const query = this.baseURL + this.getQuery('Tasks(exam)', `items`);
    const listItemType = await this.getListItemType('Tasks(exam)');
    const objType = {
      __metadata: {
        type: listItemType.d.ListItemEntityTypeFullName,
      },
    };
    const objData = JSON.stringify(Object.assign(objType, newUser));

    this.postAJAX(query, objData)
    // return $.ajax({
    //   url: query,
    //   type: 'POST',
    //   data: objData,
    //   headers: {
    //     Accept: 'application/json;odata=verbose',
    //     'Content-Type': 'application/json;odata=verbose',
    //     'X-RequestDigest':
    //       requestDigest.d.GetContextWebInformation.FormDigestValue,
    //     'X-HTTP-Method': 'POST',
    //   },
    // });
  }

  // getListItemType(url, listTitle) {
  //   const query =
  //     url +
  //     "_api/Web/Lists/getbytitle('" +
  //     listTitle +
  //     "')/ListItemEntityTypeFullName";
  //   return this.getItems(query);
  // }

  getListItemType(listTitle) {
    const query = this.getQuery(listTitle, 'ListItemEntityTypeFullName');
    return this.getItems(this.baseURL + query);
  }

  // async updateData(url) {
  //   const query = this.getQuery('Team(exam)', 'items(2)');
  //   const requestDigest = await this.requestDigest(url);
  //   console.log('requestDigest', requestDigest.d.GetContextWebInformation.FormDigestValue)
  //   const listItemType = await this.getListItemType(url, "Team(exam)");
  // }

  getAJAX(url) {
    return $.ajax({
      url,
      method: "GET",
      contentType: "application/json;odata=verbose",
      headers: {
        Accept: "application/json;odata=verbose"
      }
    });
  }

  async postAJAX(url, data) {
    const requestDigest = await this.getRequestDigest(this.baseURL);

    return $.ajax({
      url,
      method: "POST",
      data,
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': requestDigest.d.GetContextWebInformation.FormDigestValue,
        'X-HTTP-Method': 'POST',
      }
    });
  }

  getRequestDigest(webUrl) {
    return $.ajax({
      url: webUrl + '_api/contextinfo',
      method: 'POST',
      headers: {
        Accept: 'application/json; odata=verbose',
      },
    });
  }

  getQuery(queryParams, filter) {
    return `_api/web/lists/getbytitle('${queryParams}')/${filter}`
  }

  renderHTML(result) {
    try {
      const departmentsList = result.d.results;
      let departmentsItems = "";
      departmentsList.map((item) => {
        const departmentItem = new DepartmentItem(item);
        departmentsItems += departmentItem.getHTML();
      });
      document.getElementById(
        this.departmentsBodyId
      ).innerHTML = departmentsItems;

      $("#dprtBody").click(function (event) {
        const $elem = $(event.target);
        if ($elem.closest(".dprtCard")[0]) {
          window.open($elem.closest(".dprtCard").data("url"));
        }
      });
    } catch (error) {
      this.webpartNoDataContainer("dprtWrapper", "No data provided");
    }
  }

  webpartNoDataContainer(domName, errorMessage) {
    let errorHTML = `<div class="noDataContainer">
        <div id="warning-block">
            <img src="../../SiteAssets/departments/noData.svg" alt="error"/>
        </div>
      </div>`;
    document.getElementById(domName).innerHTML = errorHTML;
    console.error(`Error in ${domName} -> ${errorMessage}`);
  }
}

class DepartmentItem {
  constructor(departmentItem) {
    this.img = departmentItem.sbDepartmentIconURL;
    this.title = departmentItem.Title;
    this.web = departmentItem.sbDepartmentURL ?
      departmentItem.sbDepartmentURL.Url :
      "";
    this.website = getLocalByKey("titles", "website");
  }

  getHTML() {
    let departmentItemTemplate = `
      <div class="dprtCard dprtCard_hover" data-url=${this.web}>
        <img class="dprtCard__img" src=${this.img}  alt="photo"/>
        <h3 class="dprtCard__name">${this.title}</h3>
        <a class="dprtCard__web dprtCard__web_visited" href=${this.web}><img class="dprtCard__icon" src="${_spPageContextInfo.siteServerRelativeUrl}/SiteAssets/icons/web.png" alt="icon ">&nbsp; ${this.website}</a>
      </div>`;
    return departmentItemTemplate;
  }
}

SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
  const dprtWP = new DepartmentsWP();
  dprtWP.getData();
});