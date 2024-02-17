var productList = [];
var orderList = [];
var lstProd = [];
var vid_scan_cr = true;
async function exportToExcel() {

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    worksheet.columns = [
        { header: 'STT', key: 'stt', width: 10 },
        { header: 'Mã đơn', key: 'madon', width: 30 },
        { header: 'Tên nhân viên', key: 'tennv', width: 30 },
        { header: 'Tên Khách hàng', key: 'tenkh', width: 30 },
        { header: 'SĐT', key: 'sdt', width: 30 },
        { header: 'Địa chỉ', key: 'diachi', width: 30 },
        { header: 'Đơn giá', key: 'dongia', width: 30 },
        { header: 'Giám giá', key: 'giamgia', width: 30 },
        { header: 'Tổng tiền', key: 'tongtien', width: 30 },
        { header: 'PTTT', key: 'pttt', width: 30 },
        { header: 'PTM', key: 'ptm', width: 30 },
        { header: 'Ngày đặt hàng', key: 'ndt', width: 30 },
        { header: 'Ngày giao hàng', key: 'ngh', width: 30 },
        { header: 'Ngày thanh toán', key: 'ntt', width: 30 },
        { header: 'Ghi chú', key: 'note', width: 30 },
    ];

    let i = 1;
    orderList.forEach(function (element) {
        worksheet.addRow(
            {
                stt: i,
                madon: element.OrderCode,
                tennv: "admin",
                tenkh: element.CustomerName,
                sdt: element.CustomerPhone,
                diachi: element.Address,
                dongia: 0,
                giamgia: 0,
                tongtien: element.TotalMoney,
                pttt: element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản",
                ptm: element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy",
                ndt: getFormattedDateDMY(element.OrderDate),
                ngh: getFormattedDateDMY(element.ShipDate),
                ntt: getFormattedDateDMY(element.PaymentDate),
                note: element.Note
            });
        i++;
    });

    // Create a Blob from the workbook
    const blob = await workbook.xlsx.writeBuffer();

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = 'exported_data.xlsx';

    // Append the link to the body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);

    console.log('Excel file written');

}
const apiUrl = 'https://localhost:44315/admin/product/get-product-sku';
const requestOptions = {
    method: 'GET'
};

fetch(apiUrl, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return productList = response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
function addSanPham() {

    var select2Prod = `<option value="0" selected disabled>--Chọn sản phẩm--</option>`;

    if (productList.length > 0) {
        productList.forEach(function (element) {
            select2Prod += ` <option value="${element.ProductID}"  >${element.ProductName}</option>`;
        });
    }
    var html = `
     <tr class="pick-prod" id="tr_${index}">
        <td class="text-center" ><a class="btn btn-sm btn-danger trash-button" onclick="remove(${index})"><i class="bx bx-trash"></i></a></td>
        <td class="text-start">
            <select class="form-control item-prod select-product" id="product_select_${index}" onchange="changeProd(this,${index})">
                ${select2Prod}
            </select>
        </td>
        <td class="text-end ">
             <input type="text" class="form-control item-price"id="product_price_${index}" oninput="formatNumberInput(this)" onchange="onChangePrice(this,${index})"/>
         </td>
        <td class="text-end ">
            <input type="text" class="form-control item-quantity" id="product_quantity_${index}" oninput="formatNumberInputQuantity(this,${index})" onchange="onChangeQuantity(this,${index})"/>
        </td>
        <td class="text-end ">
            <input type="text" class="form-control item-total" readonly style="background-color: #f9f4ee;"  id="product_total_${index}"/>
        </td>
    </tr>`;

    $('#tbody_product').append(html);


    $(`.select-product`).select2({
        dropdownParent: $("#modal_order"),
        theme: "bootstrap-5",
    });

    index++;
}
function GetProduct() {
    $.ajax({
        url: '/admin/order/get-product',
        type: 'Get',
        success: function (result) {
            //  console.log(result);
            if (result.length > 0) {
                productList = result;

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function OrderSearch() {
    var status = parseInt(document.getElementById("order_status").value);
    var keyword = document.getElementById("order_keyword").value;
    var url = '/admin/order/status?order_status=' + encodeURIComponent(status) + '&order_keyword=' + encodeURIComponent(keyword);
    $.ajax({
        url: url,
        type: 'Get',
        success: function (result) {
            var html = ``;
            var index = 0;
            $("#tbody_order_hc").empty();
            $("#order_button").empty();
            orderList = result;
            result.forEach(function (element) {
                var payment = element.MedthodPayment == "cash" ? "Tiền mặt" : "Chuyển khoản"
                var purchase = element.PurchaseMethod == "online" ? "Online" : "Mua tại quầy"
                html += `
                    <tr>
                        <td class="text-center"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></td>
                        <td class="text-center">${++index}</td>
                        <td class="text-center"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></td>
                        <td class="text-center">Admin</td>
                        <td class="text-left">${element.CustomerName}</td>
                        <td class="text-center">${element.CustomerPhone}</td>
                        <td class="text-left"hite-space: nowrap;">${element.Address}</td>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center">${formatCurrency.format(element.TotalMoney)}</td>
                        <td class="text-center">${payment}</td>
                        <td class="text-center">${purchase}</td>
                        <td class="text-center">${getFormattedDateDMY(element.OrderDate)}</td>
                        <td class="text-center">${getFormattedDateDMY(element.ShipDate)}</td>
                        <td class="text-center">${getFormattedDateDMY(element.PaymentDate)}</td>
                        <td class="text-left">${element.Note}</td>
                        <td class="text-center">
                            <button type = "button" class="btn btn-info" onclick = "Edit(${element.OrderID})" ${status === 1 || status === 2 ? 'style="display:inline-block;"' : 'style="display:none;"'}> <i class="bx bx-pencil"></i></button >
                        </td >
                    </tr>`;


            });
            $("#tbody_order_hc").append(html);
            let html_2 = `
                <div class="row">    
                    <div class="col-6 justify-content-start">
                        ${status === 1 ? '<button type="button" onclick="confirmOrder()" class="btn btn-success">Xác nhận(Chuẩn bị hàng)</button>' : ''}
                        ${status === 2 || status === 3 ? '<button type="button" onclick="confirmOrder()" class="btn btn-success">Xác nhận</button>' : ''}
                        ${status === 1 || status === 2 || status === 3 ? '<button type="button" onclick="payOrder()" class="btn btn-primary">Thanh toán</button>' : ''}
                    </div>
                    <div class="col-6 d-flex justify-content-end">
                        ${status === 1 || status === 2 || status === 3 ? '<button type="button" onclick="cancelOrder()" class="btn btn-danger">Hủy đơn</button>' : ''}
                    </div>
                </div>
            `;
            $("#order_button").append(html_2);
        },
        error: function (err) {
            console.log(err)
        }
    });

}

$(document).ready(function () {
    GetProduct();
    OrderSearch();
    $("#modal_order").on("hidden.bs.modal", function () {
        $('#tbody_product').empty();
        $('#orderid_order').val(0);
        $('#order_code').val("");
        $('#customer_name').val("");
        $('#customer_address').val("");
        $('#order_note').val("");
        $('#customer_phone').val("");
        $("#payment_method").val("");
    });
});
function confirmOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        var checkedElement = $(this);
        var elementId = checkedElement.data('id');
        ids.push(elementId);

    });

    if (ids.length < 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn Hóa đơn muốn Xác nhận!',
            text: `Thất bại`,
            showConfirmButton: false,
            timer: 1000
        })
    }

    $.ajax({
        url: '/admin/order/confirm',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function cancelOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        var checkedElement = $(this);
        var elementId = checkedElement.data('id');
        ids.push(elementId);
    });

    if (ids.length <= 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn hóa đơn muốn hủy!',
            text: ``,
            showConfirmButton: false,
            timer: 2000
        })
    }

    var dataToSend = JSON.stringify({ orderIDs: ids });
    $.ajax({
        url: '/admin/order/cancel',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function payOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        var checkedElement = $(this); // 'checkedElement' refers to the current checked element in the loop

        // Accessing attributes or performing operations on the checked element
        var elementId = checkedElement.data('id'); // Get the ID of the checked element
        ids.push(elementId);

    });
    var dataToSend = JSON.stringify({ orderIDs: ids });
    $.ajax({
        url: '/admin/order/payorder',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function addHDOrder(id) {
    $.ajax({
        url: '/admin/order/' + id,
        type: 'get',
        success: function (result) {
            if (result) {

                var date = new Date(result.OrderDate);

                // Format the date to 'dd/MM/yyyy'
                var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                // Initialize invoiceDetails object with basic details
                var invoiceDetails = {
                    date: OrderDate,
                    orderCode: result.OrderCode,
                    customerName: result.CustomerName,
                    customerPhone: result.CustomerPhone,
                    customerAddress: result.Address,
                    products: [],
                    totalPrice: 0,
                    totalPayment: 0
                };

                // Process products if available
                if (result.prods && result.prods.length > 0) {
                    result.prods.forEach(function (ele) {
                        // Push individual product details into products array
                        invoiceDetails.products.push({
                            name: ele.Name + " | " + ele.Skus,
                            quantity: ele.Quantity,
                            price: ele.Price
                        });
                    });

                    // Calculate total price for products
                    invoiceDetails.totalPrice = invoiceDetails.products.reduce(function (accumulator, product) {
                        return accumulator + product.price;
                    }, 0);

                    // Set totalPayment same as totalPrice initially
                    invoiceDetails.totalPayment = invoiceDetails.totalPrice;
                }

                // Populate invoice details in the modal
                populateInvoiceDetails(invoiceDetails);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#showHD').modal('show');
}
function validate() {
    var count = 0;
    var orderCode = $('#order_code').val();
    if (orderCode == '') {
        count++;
    }

    return true;
}

function isValidPhoneNumber(phoneNumber) {
    let phonePattern = /(03|05|07|08|09)+([0-9]{8})\b/g;
    return phonePattern.test(phoneNumber);
}

function createOrder() {
    if (!validate()) return;
    var counts = 0;
    var mesErr = $('#error-message');
    var order = {
        OrderID: parseInt($('#orderid_order').val()),
        CustomerName: $('#customer_name').val(),
        Address: $('#customer_address').val(),
        Note: $('#order_note').val(),
        CustomerPhone: $('#customer_phone').val(),
        MedthodPayment: $("#payment_method").val(),
        OrderCode: $("#order_code-cr").val(),
        PurchaseMethod: $("#order_code").val()
    }
    order.prods = lstProd;
    if (counts > 0) {
        $('#error-message').text('');
        return;
    }
    console.log(order);
    $.ajax({
        url: '/admin/order/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(order),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                })
                $("#modal_order").modal("hide");
                $("#borderedTab").find(".active").click();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(a)
        }
    });
}


var index = 0;


function onChangePrice(input, index) {
    var price = parseInt(input.value.replace(/[^0-9]/g, ''));
    var quantity = parseInt($(`#product_quantity_${index}`).val().replace(/[^0-9]/g, ''))
    $(`#product_total_${index}`).val(formatCurrency.format(price * quantity));
}

function onChangeQuantity(input, index) {
    var quantity = parseInt(input.value.replace(/[^0-9]/g, ''));
    var price = parseInt($(`#product_price_${index}`).val().replace(/[^0-9]/g, ''))
    $(`#product_total_${index}`).val(formatCurrency.format(price * quantity));
}


function removeOrder(id) {
    $.ajax({
        url: '/admin/order/delete/' + id,
        type: 'Post',
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function changeProd(element, index) {
    var id = element.value;
    var check = [];
    $(".pick-prod").each(function (index) {
        const productID = parseInt($(this).find(".item-prod").val());
        const existingProduct = check.includes(productID);
        if (existingProduct) {
            $(element).val(0).trigger('change');
            $(`#product_price_${index}`).val('');
            $(`#product_quantity_${index}`).val('');
            $(`#product_total_${index}`).val('');
            return;
        }
        check.push(productID);
    });

    var product = productList.find(p => p.ProductSkusID == id);

    $(`#product_price_${index}`).val(product.Price.toLocaleString('en-US'));
    $(`#product_quantity_${index}`).val(1);
    $(`#product_total_${index}`).val(product.Price.toLocaleString('en-US'));
}
// Function to populate the invoice details
function populateInvoiceDetails(data) {
    document.getElementById('dateExport').textContent = data.date;
    document.getElementById('orderCodeExport').textContent = data.orderCode;
    document.getElementById('customerNameExport').textContent = data.customerName;
    document.getElementById('customerPhoneExport').textContent = data.customerPhone;
    document.getElementById('customerArdessExport').textContent = data.customerAddress;
    var prodTable = document.querySelector('.prodOrderExport');
    prodTable.innerHTML = ''; // Clear existing rows
    data.products.forEach(function (product) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
        `;
        prodTable.appendChild(row);
    });
    document.getElementById('totalPriceExport').textContent = data.totalPrice;
    document.getElementById('totalPayport').textContent = data.totalPayment;
}

function formatNumberInput(input) {

    if (isNaN(input.value)) {
        input.value = input.value.replace(/[^0-9]/g, '');
    }
    input.value = parseFloat(input.value).toLocaleString('en-US');
}
function formatNumberInputQuantity(input, index) {
    var id = $(`#product_select_${index}`).val();
    var product = productList.find(p => p.ProductSkusID == id);

    if (isNaN(input.value)) {
        input.value = input.value.replace(/[^0-9]/g, '');
    }
    var value = parseFloat(input.value);
    if (value > product.Quantity) {
        value = product.Quantity;
    }
    input.value = value.toLocaleString('en-US');
}

function startScanner() {
    // Get the video element for the camera feed
    var videoElement = document.getElementById('preview-cr');
    if (!vid_scan_cr) {
        videoElement = document.getElementById('preview-upd');
    }
    // Get the result element to display scanned QR code data
    var resultElement = document.getElementById('result');
    // Create a new Instascan scanner instance
    var scanner = new Instascan.Scanner({ video: videoElement });
    // Add a callback function when a QR code is scanned
    scanner.addListener('scan', function (content) {
        resultElement.innerHTML = 'Scanned QR Code: ' + content;
        getProductBySkuId(content)
            .then(result => {
                if (result.Quantity <= 0) {
                    Swal.fire('Hết hàng!', '', 'error');
                    return;
                }
                let checkErr = lstProd.filter(obj => obj.Sku == result.Sku && obj.ProductSkusID == result.ProductSkusID);
                if (checkErr.length === 0) {
                    result.MaxQuantity = result.Quantity;
                    result.Quantity = 1;
                    lstProd.push(result);
                } else {
                    lstProd.map(el => {
                        if (el.Sku == result.Sku && el.ProductSkusID == result.ProductSkusID) {
                            if (el.Quantity + 1 > el.MaxQuantity) {
                                Swal.fire('Quá số lượng trong kho!', '', 'error');
                                return;
                            }
                            el.Quantity += 1;
                        }
                    });
                }
                if (!vid_scan_cr) {
                    show_prod_upd();
                }
                else {
                    show_prod()
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // Start the scanner
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

function onchangeAddBySku() {
    let cr = true;
    let inp = document.getElementById('sku-cr');
    if (inp.value === '') {
        cr = false;
        inp = document.getElementById('sku-upd');
    }
    let sku = inp.value;
    console.log(sku);
    inp.value = '';
    getProductBySkuId(sku)
        .then(result => {
            let checkErr = lstProd.filter(obj => obj.Sku == result.Sku && obj.ProductSkusID == result.ProductSkusID);
            if (checkErr.length === 0) {
                result.MaxQuantity = result.Quantity;
                result.Quantity = 1;
                lstProd.push(result);
            } else {
                lstProd.map(el => {
                    if (el.quantity + 1 > el.MaxQuantity) {
                        Swal.fire('Quá số lượng trong kho!', '', 'error')
                    }
                    else if (el.Sku == result.Sku && el.ProductSkusID == result.ProductSkusID) {
                        el.Quantity += 1;
                    }
                });
            }
            if (!vid_scan_cr) {
                show_prod_upd();
            }
            else {
                show_prod()
            }
            // then product new get to table in Modal
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Create
function add() {
    lstProd = [];
    const currentDate = new Date();
    const currentTick = currentDate.getTime();
    var code = "HD_" + currentTick;
    $("#order_code-cr").val(code);
    $('#create-order').modal('show');
    vid_scan_cr = true;
}

function getProductBySkuId(skuId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/admin/product/get-product-by-skuname?skuname=${skuId}`,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (result) {
                resolve(result);  // Resolve the promise with the result
            },
            error: function (err) {
                console.log(err);
                reject(err);  // Reject the promise with the error
            }
        });
    });
}

function onchangeQuantity(type, id) {
    let inp = document.getElementById('sku-' + id);
    let quantity = Number.parseInt(inp.value);
    if (quantity <= 0) {
        Swal.fire('Lỗi số lượng!', '', 'error')
    } else {
        lstProd.map(el => {
            if (el.ProductSkusID == id) {
                if (el.MaxQuantity < quantity) {
                    Swal.fire('Quá số lượng trong kho!', '', 'error')
                } else {
                    el.Quantity = quantity;
                }
            }
        });
    }
    if (type == 0) {
        show_prod()
    } else {
        show_prod_upd();
    }
}

function remove_prod(id) {
    lstProd = lstProd.filter(obj => obj.ProductSkusID != id);
    show_prod();
}

function show_prod() {
    let html = ``;
    lstProd.map(el => {
        html += `<tr class="text-center">
                            <td class="text-center" ><a class="btn btn-sm btn-danger trash-button" onclick="remove_prod(${el.ProductSkusID})"><i class="bx bx-trash"></i></a></td>
                            <td style="width:40%">${el.ProductName}</td>
                            <td style="width:20%">${el.Price}</td>
                            <td style="width:20%"><input id='sku-${el.ProductSkusID}' onchange="onchangeQuantity(0,${el.ProductSkusID})" value=${el.Quantity}></td>
                            <td style="width:20%">${el.Price * el.Quantity}</td>
                        </tr>`;
    });
    $('#tbody_product-cr').html(html);
}

// Update

function Edit(id) {
    $.ajax({
        url: '/admin/order/' + id,
        type: 'get',
        success: function (result) {
            if (result) {
                $('#orderid_order').val(result.OrderID);
                $('#order_code').val(result.OrderCode);
                $('#customer_name').val(result.CustomerName);
                $('#customer_address').val(result.Address);
                $('#order_note').val(result.Note);
                $('#customer_phone').val(result.CustomerPhone);
                $("#payment_method").val(result.MedthodPayment);

                let html = ``;
                lstProd = result.prods;
                if (lstProd === null) lstProd = [];
                if (lstProd.length > 0) {
                    show_prod_upd();
                }
            }
            console.log(result);
        },
        error: function (err) {
            console.log(err)
        }
    });
    $('#modal_order').modal('show');
    vid_scan_cr = false;
}


function remove(orderId, skuId) {
    console.log(skuId);
    $.ajax({
        url: `order/delete-prod?idOrder=${orderId}&idSku=${skuId}`,
        type: 'delete',
        success: function (result) {
            if (result !== 0) {
                lstProd = lstProd.filter(obj => obj.ProductSkusID != skuId);
                show_prod_upd();
            }
            console.log(result);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function show_prod_upd() {
    console.log(lstProd)
    let html = ``;
    lstProd.map(el => {
        html += `<tr class="text-center">
                            <td class="text-center" ><a class="btn btn-sm btn-danger trash-button" onclick="remove(${result.OrderID},${el.ProductSkusID})"><i class="bx bx-trash"></i></a></td>
                            <td style="width:40%">${el.ProductName}</td>
                            <td style="width:20%">${el.Price}</td>
                            <td style="width:20%"><input id='sku-${el.ProductSkusID}' onchange="onchangeQuantity(1,${el.ProductSkusID})" value=${el.Quantity}></td>
                            <td style="width:20%">${el.Price * el.Quantity}</td>
                        </tr>`;
    });
    $('#tbody_product-upd').html(html);
}
