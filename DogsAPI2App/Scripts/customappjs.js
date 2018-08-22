
$(document).ready(function () {
    $('#accountDetailContiner').hide();
    $('#fundTransferForm').hide();
    $('#accountDetailTable').find('tr').click(function () {
        var selected = $(this).hasClass("rowColor");
        $("#accountDetailTable tr").removeClass("rowColor");
        if (!selected)
            $(this).addClass("rowColor");

        var accountnum = $(this).children('td:first').text().trim();
        var formData = new FormData();
        formData.append("AccountNumber", accountnum);

        $.ajax({
            url: '/AccountInfo/AccountInformation/GetAccountDetail',
            type: 'POST',
            data: formData,
            dataType: "Json",
            contentType: false,
            processData: false,
            success: function (result) {
                $('#accountDetailContiner').show();
                var response = [result];
                var keysinResponse = [];
                for (var key in result) {
                    keysinResponse.push(key);

                }
                var leftDiv = "";
                for (var i = 0; i < keysinResponse.length; i++) {
                    leftDiv = leftDiv + "<span>" + keysinResponse[i] + ":" + "</span>" + "<br />";
                }

                var valuesinResponse = [];
                for (var i = 0; i < response.length; i++) {                   
                    valuesinResponse.push(response[i].CustomerId);
                    valuesinResponse.push(response[i].AccountNumber);
                    valuesinResponse.push(response[i].AccountType);
                    valuesinResponse.push(response[i].MinBalance);
                    valuesinResponse.push(response[i].BranchName);
                    var formatedDate = response[i].DateOfOpening;
                    var date = new Date();
                    var formatedDate = date.getMonth(formatedDate) + "-" + date.getFullYear(formatedDate) + "-" + date.getDay(formatedDate);
                    valuesinResponse.push(formatedDate);
                    valuesinResponse.push(response[i].CurrentBalance);
                }
                var rightDiv = "";
                for (var i = 0; i < valuesinResponse.length; i++) {
                    rightDiv = rightDiv + "<span>" + valuesinResponse[i] + "</span>" + "<br />";

                }
                var divHeading = $('<div />').attr('id', 'divHeading').html('Selected Account Detail').addClass('heading');
                $("#accountDetailContiner").empty();
                $("#divHeading").remove();
                $(divHeading).insertBefore("#accountDetailContiner");

                var divLeft = $('<div />').addClass('divLeft');
                $(divLeft).appendTo("#accountDetailContiner").empty().append(leftDiv);

                var divRight = $('<div />').addClass('divRight');
                $(divRight).appendTo("#accountDetailContiner").empty().append(rightDiv);
            }
        });
    });

    $("#secondDiv").click(function () {
        $("#secondDiv input:checked").each(function () {

            var selectedTransferType = $(this).val();
            $.ajax({
                url: '/FundTransfer/FundTransfer/GetTransactionType',
                data: { 'selectedTransferType': selectedTransferType },
                type: 'POST',
                dataType: "json",
                success: function (result) {
                    $('#fundTransferForm').show();
                    $("#fundTransferForm").empty();

                    var divHeading = $('<div />').attr('id', 'divHeading').html('Selected Account Detail').addClass('heading');
                    $("#fundTransferForm").empty();
                    $("#divHeading").remove();
                    $(divHeading).insertBefore("#fundTransferForm");

                    var leftDiv = "";
                    leftDiv = leftDiv + "<span>" + "From:" + "</span>" + "<br />" + "<br />" + "<span>" + "To:" + "</span>" + "<br />" + "<br />" + "<span>" + " Amount to Transfer:" + "</span>" + "<br />" + "<br />" + "<span>" + "Current Balance :" + "</span>";

                    var leftDivAddtoParentDiv = $('<div />').addClass('divLeft');
                    $(leftDivAddtoParentDiv).appendTo("#fundTransferForm").empty().append(leftDiv);


                    var optionTag = "";
                    for (var i = 0; i < result.length; i++) {
                        optionTag = optionTag + "<option >" + result[i] + "</option >"
                    }

                    var selecttag = "<select id='fromAccount'>" + "</select>" + "<br />" + "<br />" + "<input id='toAccount'>" + "</input>" + "<br />" + "<br />" + "<input id='amount'>" + "</input>" + "<br />" + "<br />" + "<span id='currentBalance'>" + "</span>" + "<br />" + "<input  id='btnAmountTransfer' type='button' value='Transfer Amount'>" + "</input>";
                    var rightDiv = $('<div />').addClass('divRight');

                    $(rightDiv).appendTo("#fundTransferForm").empty().append(selecttag);
                    $(optionTag).appendTo("select");
                    $("#fromAccount").css('width', 175)

                }

            });
        });
    });

    $(document).on('click', '#btnAmountTransfer', function () {

        var fromAccount = $("#fromAccount").val();
        var toAccount = $("#toAccount").val();
        var amountToTransfer = $("#amount").val();

        var amountTransferInfo = new AmountTransferInfo();
        amountTransferInfo.FromAccount = fromAccount;
        amountTransferInfo.ToAccount = toAccount;
        amountTransferInfo.TransactionAmount = amountToTransfer;
        console.log(JSON.stringify(amountTransferInfo));

        $.ajax({
            url: '/FundTransfer/FundTransfer/GetCurrentBalanceAfterTransfer',
            data: amountTransferInfo,
            type: 'POST',
            dataType: "json",
            success: function (result) {
                $("span[id='currentBalance']").text(result).css('color', 'red');;
            }
        });
    });

    function AmountTransferInfo() {
        this.FromAccount;
        this.ToAccount;
        this.TransctionAmount;
    }

});

