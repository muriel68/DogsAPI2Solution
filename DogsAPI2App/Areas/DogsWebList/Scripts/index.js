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
                add: false,
                del: false,
                search: true,
                refresh: true,
                closeAfterSearch: true
            },
            {
                //All the options are implemented so we can revert back to jqGrid built-in CRUD if need be
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
            var Delete = "<a href='#' class='deleteDog' data-id='" + rowObject.DogName + "'>Delete</a>";
            return Delete;
        }

        function displayDogTypes(cellvalue, options, rowObject) {

            var dogname = rowObject.DogName;
            var html = "";
            if (rowObject.Dogtype.length > 0) {
                var dogtypearray = rowObject.Dogtype[0].split(',');
                $.each(dogtypearray, function (index, value) {
                    html += "<div class='roundContainer'>" + value + "&nbsp<a href='#' class='deleteDogType' data-dogtypeid='" + value + "' data-id='" + dogname + "'><b>X</b></a></div>&nbsp&nbsp";
                });
            }
            return html + "<a href='#' class='addDogType' data-id='" + dogname + "'>add type</a>";
        }

        //removing built-in title and replcing with add anchor
        $(".ui-jqgrid-title").html("<span class='fa fa-plus'><a href='#' class='addDog' style='color:white;'>Add Dog</a></span>");

        //Dialogs
        $('#addDialog').dialog({
            zIndex: 100,
            autoOpen: false,
            height: 320,
            width: 500,
            modal: true,
            resizable: true,
            buttons: {
                "Submit": function (eve) {

                    SubmitNewDog(eve);
                    ClearInputs();
                    $("div#addDialog").dialog("close");
                },
                "Close": function () {
                    $("div#addDialog").dialog("close");
                    ClearInputs();
                }
            }
        });


 
        $('#editDialog').dialog({
            zIndex:100,
            autoOpen: false,
            height: 300,
            width: 500,
            modal: true,
            resizable: true,
            buttons: {
                "Submit": function (eve) {

                    SubmitEditDog(eve);
                    ClearInputs();
                    $("div#editDialog").dialog("close");
                },
                "Close": function () {
                    $("div#editDialog").dialog("close");
                    ClearInputs();
                }
            }
        });

        $('#addDogTypeDialog').dialog({
            zIndex: 100,
            autoOpen: false,
            height: 240,
            width: 500,
            modal: true,
            resizable: true,
            buttons: {
                "Add": function (eve) {

                    SubmitNewDogType(eve);
                    ClearInputs();
                    $("div#addDogTypeDialog").dialog("close");
                },
                "Close": function () {
                    $("div#addDogTypeDialog").dialog("close");
                }
            }
        });
    });

    //End Dialogs

    function DoubleClickRow(data) {
        $("#editDialog").dialog("open", "modal", true);
        ClearInputs();
        $.post('/DogList/GetDog', { Dogname: data.DogName },
           function (returnedDog) {
               $("#hdDogNameForUpdate").val(returnedDog.DogName);
               $("#tbDogName").val(returnedDog.DogName);
               $("#taDogType").val(returnedDog.Dogtype.join(', '));

           }).fail(function () {
               console.log("error");
           });
    }

    $('body').on('click', 'a.deleteDog', function (event) {
        var dogname = this.dataset.id;

        var result = window.confirm('Are you sure?, This cannot be undone');
        if (result == false) {
            e.preventDefault();
        } else {
            $.post('/DogList/DeleteDog', { Dogname: dogname },
                function (returnedData) {
                    $('#jqDogGrid').trigger('reloadGrid');
                    console.log(returnedData);
                }).fail(function () {
                    console.log("error");
                });
        }
    });

    $('body').on('click', 'a.addDog', function (event) {

        $("#addDialog").dialog("open", "modal", true);

    });

    $('body').on('click', 'a.deleteDogType', function (event) {
        var dogname = this.dataset.id;
        var dogtype = this.dataset.dogtypeid;
        $.post('/DogList/DeleteDogType', { Dogname: dogname, Dogtype: dogtype },
            function (returnedData) {
                $('#jqDogGrid').trigger('reloadGrid');
                console.log(returnedData);
            }).fail(function () {
                console.log("error");
            });
    });

        $('body').on('click', 'a.addDogType', function (event) {
            var dogname = this.dataset.id;

            $("#hdDogType").val(dogname);
               $("#addDogTypeDialog").dialog("open", "modal", true);
        });

        function SubmitNewDog()
        {
          var dogtype = $("#taDogTypeAdd").val();
          var dogname = $("#tbDogNameAdd").val();

          dogtype = StripDuplicateDogTypes(dogtype);
          debugger;

         $.post('/DogList/CreateDog', { Dogname: dogname, Dogtype: dogtype, DogNameForUpdate: dogname },
         function (returnedData) {
             $('#jqDogGrid').trigger('reloadGrid');
             console.log(returnedData);
         }).fail(function () {
             console.log("error");
         });
        }

        function SubmitEditDog(eve){
 
        var dogtype = $("#taDogType").val();
        var dogname = $("#tbDogName").val();
        var dognameforupdate = $("#hdDogNameForUpdate").val();
        dogtype = StripDuplicateDogTypes(dogtype);

            $.post('/DogList/EditDog', { DogName: dogname, Dogtype: dogtype, DogNameForUpdate: dognameforupdate },
            function (returnedData) {
                $('#jqDogGrid').trigger('reloadGrid');
                console.log(returnedData);
            }).fail(function () {
                console.log("error");
            });
    }

    function SubmitNewDogType(eve){
 
        var dogtype = $("#tbDogTypeName").val();
        var dogname = $("#hdDogType").val();
        var updatedDogtypes;

        //Getting dog so we can check for duplicate dogtypes
        $.post('/DogList/GetDog', { Dogname: dogname },
       function (returnedDog) {
           if(CheckForDuplicatesInArray(returnedDog.Dogtype, dogtype))
           {
               //Alert the user
               alert(dogtype + " is already a type for '" + dogname + "'");
           } else {
               $.post('/DogList/AddDogType', { Dogname: dogname, Dogtype: dogtype },
                function (returnedData) {
                    $('#jqDogGrid').trigger('reloadGrid');
                    console.log(returnedData);
                }).fail(function () {
                    console.log("error");
                });
           }
       }).fail(function () {
           console.log("error");
       });

    }

    function CheckForDuplicatesInArray(dogtype, dogtypename)
    {
        if (jQuery.inArray(dogtypename, dogtype) != '-1') {
            return true;
        }
        return false;
    }

    function StripDuplicateDogTypes(dogtypes) {
        var items = dogtypes.split(",");
        var arrlen = items.length - 1;
        var i = 0;
        var outValue = "";
        var prevItem;
        while (i <= arrlen) {
            if (outValue.length > 0) {
                if (prevItem != items[i].trim()) {
                    var str = items[i].trim();
                    outValue = outValue.replace(prevItem + ",", "");
                    outValue += ", " + str;
                }
            }
            else {
                outValue = items[i].trim();
            }
            prevItem = items[i].trim();
            i++;
        }
        return outValue;
    }

    function ClearInputs()
    {
        $("#tbDogTypeName").val("");
        $("#hdDogType").val("");
        $("#tbDogTypeName").val("");
        $("#taDogTypeAdd").val("");
        $("#tbDogNameAdd").val("");
    }

});

