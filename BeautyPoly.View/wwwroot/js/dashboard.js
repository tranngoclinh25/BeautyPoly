$(document).ready(function () {
    //var currentDate = new Date();
    //var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    //startDate = formatDateTime(startDate);
    //var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    //endDate = formatDateTime(endDate);
    //GetProductThongKe(startDate, endDate);
    GetDataToptenProduct();
    GetDataThongKe();
    GetRevenue();
});
var charts = {
    topten: null,
    revennue: null
}
function formatDateTime(date) {
    var year = date.getFullYear();
    var month = padZero(date.getMonth() + 1); // Tháng là zero-based, nên cộng thêm 1
    var day = padZero(date.getDate());
    var hours = padZero(date.getHours());
    var minutes = padZero(date.getMinutes());
    var seconds = padZero(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function padZero(value) {
    return value < 10 ? '0' + value : value;
}
function GetProductThongKe(dateStart, dateEnd) {
    $.ajax({
        url: '/admin/home/GetProductToDashboard',
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { dateStart: dateStart, dateEnd: dateEnd },
        success: function (result) {
            var html = ``;
            $.each(result, (key, item) => {
                html += ` <tr>
                            <th scope="row"><a href="#"><img src="images/${item.Image}" alt=""></a></th>
                            <td><a href="#" class="text-primary fw-bold">${item.ProductName}</a></td>
                            <td>${formatCurrency.format(item.Price)}</td>
                            <td class="fw-bold">${item.TotalQuantity}</td>
                            <td>${formatCurrency.format(item.TotalMoney)}</td>
                        </tr>`;

            });
            console.log(result);
            $("#tbody_dashboard").html(html);
        },
        error: function (err) {

        }
    });
}

function Today() {
    $("#title_product_dashboard").text("| Today")
    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);
    GetProductThongKe(startDate, endDate);
}

function ThisMonth() {
    $("#title_product_dashboard").text("| This month")

    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);

    GetProductThongKe(startDate, endDate);
}

function ThisYear() {
    $("#title_product_dashboard").text("| This year")

    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    startDate = formatDateTime(startDate);
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    endDate = formatDateTime(endDate);
    GetProductThongKe(startDate, endDate);
}

function GetDataToptenProduct() {
    $.ajax({
        url: '/admin/home/GetProductToDashboard',
        type: 'GET',
        dataType: 'json',
        data: {
            flag: parseInt($("#topten_flag").val())
        },
        contentType: 'application/json',
        success: function (result) {
            var qty = result.map((item) => item.TotalQuantity);
            var name = result.map((item) => item.ProductName);
            if (charts.topten) {
                charts.topten.updateSeries([{
                    data: qty
                }]);
                charts.topten.updateOptions({
                    xaxis: {
                        categories: name,
                    }
                });
                return;
            }
            var options = {
                series: [{
                    name: 'Số lượng',
                    data: qty
                }],
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true, dataLabels: {
                            position: 'center', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return `${new Intl.NumberFormat().format(val)}`
                    },
                },
                xaxis: {
                    categories: name,
                }
            };

            charts.topten = new ApexCharts(document.querySelector("#barChart"), options);
            charts.topten.render();
        },
        error: function (err) {
            alert(err.responseText);
        }
    })
}

function GetDataThongKe() {
    $.ajax({
        url: '/admin/home/GetDataInDay',
        type: 'GET',
        dataType: 'json',
        //data: {
        //    dateStart: $('#datestart_reports').val(),
        //    dateEnd: $('#dateend_reports').val(),
        //},
        contentType: 'application/json',
        success: function (result) {
            $('#soluongban').text(`${result.ProductSaleInDay.toLocaleString('en-US')}`);
            $('#tiennhap').text(`${formatCurrency.format(result.TotalCapitalPrice)}`);
            $('#tienban').text(`${formatCurrency.format(result.TotalPrice)}`);
            $('#doanhthu').text(`${formatCurrency.format(result.Revenue)}`);
        },
        error: function (err) {
            alert(err.responseText);
        }
    })
}

function GetRevenue() {
    $.ajax({
        url: '/admin/home/GetRevenueChart',
        type: 'GET',
        dataType: 'json',
        data: {
            flag: parseInt($("#revennue_flag").val())
        },
        contentType: 'application/json',
        success: function (result) {
            var arrTongTien = result.map((item) => item.TotalTongTien);
            var arrDay = result.map((item) => item.Day);

            var tong = arrTongTien.reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            $('#revenue_sum').text(`${new Intl.NumberFormat().format(tong)} VND`);
            if (charts.revennue) {
                charts.revennue.updateSeries([{
                    data: arrTongTien
                }]);
                charts.revennue.updateOptions({
                    xaxis: {
                        categories: arrDay,
                    }
                });
                return;
            }
            var options = {
                series: [{
                    name: 'Doanh thu',
                    data: arrTongTien
                }],
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded', dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return `${new Intl.NumberFormat().format(val)}` + " VND"
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },

                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: arrDay,
                },
                yaxis: {
                    title: {
                        text: 'vnđ'
                    }, labels: {
                        formatter: function (value) {
                            return `${new Intl.NumberFormat().format(value)}`;
                        }
                    },
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return `${new Intl.NumberFormat().format(val)}` + " VND"
                        }
                    }
                }
            };

            charts.revennue = new ApexCharts(document.querySelector("#chart_revenue"), options);
            charts.revennue.render();

        }
        , error: function (err) {

        }
    });


}