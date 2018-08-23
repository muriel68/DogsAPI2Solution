$(document).ready(function () {


    $(function () {
        //  debugger;
        $("#jqDogGrid").jqGrid
        ({
            url: "/DogList/DogDatasource",
            datatype: 'json',
            mtype: 'Get',
            //table header name  
            colNames: ['DogID', 'DogName', 'DogType'],
            //colModel takes the data from controller and binds to grid  
            colModel: [
            {
                name: "DogID",
                key: true,
                hidden: true
            },
            {
                name: "DogName", editable: true, editrules: { required: true }
            },
            {
                name: "DogType", editable: true
            },
            ],
            height: '100%',
            rowNum: 10,
            pager: jQuery('#pager'),
            rowList: [10, 20, 30, 40],
            viewrecords: true,
            caption: 'Dogs API',
            emptyrecords: 'No records',
            jsonReader:
            {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                Id: "0"
            },
            autowidth: true,
        }).navGrid('#pager',
            {
                edit: true,
                add: true,
                del: true,
                search: true,
                refresh: true,
                closeAfterSearch: true
            },
            {
                // edit option  
                zIndex: 100,
                url: '/DogList/EditDog',
                closeOnEscape: true,
                closeAfterEdit: true,
                recreateForm: true,
                afterComplete: function (response) {
                    if (response.responseText) {
                        alert(response.responseText);
                    }
                }
            },
            {
                // add options  
                zIndex: 100,
                url: "/DogList/CreateDog",
                closeOnEscape: true,
                closeAfterAdd: true,
                afterComplete: function (response) {
                    if (response.responseJSON) {
                        if (response.responseJSON == "Saved Successfully") {
                            alert("Saved Successfully");
                        }
                        else {
                            var message = "";
                            for (var i = 0; i < response.responseJSON.length; i++) {
                                message += response.responseJSON[i];
                                message += "\n";
                            }
                        }
                    }
                }
            },
            {
                // delete option  
                zIndex: 100,
                url: "/DogList/DeleteDog",
                closeOnEscape: true,
                closeAfterDelete: true,
                recreateForm: true,
                msg: "Are you sure you want to delete this dog?",
                afterComplete: function (response) {
                    if (response.responseText) {
                        alert(response.responseText);
                    }
                }
            }
        );
    });
});

