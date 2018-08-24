$(document).ready(function () {


    $(function () {
        //  debugger;
        $("#jqDogGrid").jqGrid
        ({
            ondblClickRow: function (rowid,iRow,iCol,e) {
                var data = $('#jqDogGrid').getRowData(rowid);

                DoubleClickRow(data);
            },
            url: "/DogList/DogDatasource",
            datatype: 'json',
            mtype: 'Get',
            //table header name  
            colNames: ['DogNameForUpdate', 'DogName', 'DogType', 'Actions'],
            //colModel takes the data from controller and binds to grid  
            colModel: [
            {
                name: "DogNameForUpdate", hidden: true, editable: true
            },
            {
                name: "DogName", editable: true, editrules: { required: true }
            },
            {
                key: false, name: "DogType", index: 'DogType', editable: true, formatter: displayDogTypes, title: false
            },
                { key: false, name: 'Actions', index: 'Actions', editable: false, formatter: displayButtons, title: false }
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
                edit: false,
                add: true,
                del: false,
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
                      //  alert(response.responseText);
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
                          //  alert("Saved Successfully");
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
                      //  alert(response.responseText);
                    }
                }
            }
        );

        function displayButtons(cellvalue, options, rowObject) {
          //  debugger;
            var Delete = "<a href='#' class='deleteDog' data-id='" + rowObject.DogName + "'>Delete</a>";
            return Delete;
        }

        function displayDogTypes(cellvalue, options, rowObject) {
            //   debugger;

            var dogname = rowObject.DogName;

            var html = "";
            if (rowObject.Dogtype.length > 0) {
                var dogtypearray = rowObject.Dogtype[0].split(',');
                $.each(dogtypearray, function (index, value) {
                    html += "<div class='roundContainer'>" + value + "&nbsp<a href='#' class='deleteDogType' data-dogtypeid='" + value + "' data-id='" + dogname + "'><b>X</b></a></div>&nbsp&nbsp";
                });
                return html;
            }
            return "";
        }


        $('#editDialog').dialog({
            zIndex:100,
            autoOpen: false,
            height: 200,
            width: 500,
            modal: true,
            resizable: true,
            open: function (event, ui) {

            }
        });
    });

    function DoubleClickRow(data) {
     //   debugger;
        $("#editDialog").dialog("open", "modal", true);
        $("#tbDogName").val(data.DogName);
    }

    $('body').on('click', 'a.deleteDog', function (event) {
        var dogname = this.dataset.id;
        $.post('DogList/DeleteDog', { Dogname: dogname}, 
            function(returnedData){
                $('#jqDogGrid').trigger('reloadGrid');
                console.log(returnedData);
            }).fail(function(){
                console.log("error");
            });
    });

    $('body').on('click', 'a.deleteDogType', function (event) {
        var dogname = this.dataset.id;
        var dogtype = this.dataset.dogtypeid;
        $.post('DogList/DeleteDogType', { Dogname: dogname, Dogtype: dogtype },
            function (returnedData) {
                $('#jqDogGrid').trigger('reloadGrid');
                console.log(returnedData);
            }).fail(function () {
                console.log("error");
            });
    });
});

