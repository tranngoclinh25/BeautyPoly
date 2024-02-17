var arrCate = [];

$(document).ready(function () {
    GetAll();
});
function GetAll() {
    var keyword = $('#cate_keyword').val();
    $.ajax({
        url: '/admin/categories/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCate = result;
            var html = '';
            $.each(result, function (key, item) {
                var isDelete = item.isDelete ? "checked" : ""
                html += `<tr>
                           <td>
                               <button class="btn btn-success btn-sm" onclick="edit(${item.cateID})">
                                    <i class="bx bx-pencil"></i>
                               </button>
                                <button class="btn btn-danger btn-sm" onclick="Delete(${item.cateID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td>${item.cateCode}</td>
                            <td>${item.cateName}</td>
                            <td >
                                <div class="form-check form-switch d-flex justify-content-center align-items-center" style="height: 100%;">
                                    <input class="form-check-input" onclick="onchangeStt(${item.cateID})"  type="checkbox" id="${item.cateID}" ${isDelete}>
                                </div>
                            </td>
                        </tr>`;
            });
            $('#tbody_cate').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function validate() {
    var count = 0;
    var cateName = $('#cate_name_cate').val();
    var cateCode = $('#cate_code_cate').val();
    if (cateName == '') {

        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không được để trống tên danh mục',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }

    if (cateCode == '') {

        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không được để trống mã danh mục',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }
    return true;
}

function create() {
    if (!validate()) return;
    var id = parseInt($('#cateid').val());
    var cateCode = $('#cate_code_cate').val();
    var cateName = $('#cate_name_cate').val();
    var isdelete = $('#isdelete_cate').prop('checked');


    var obj = {
        CateID: id,    
        CateCode: cateCode,
        CateName: cateName,
        IsDelete: isdelete
    }
    $.ajax({
        url: '/admin/categories/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                Swal.fire('Thành công', '', 'success')
                GetAll();
                $('#modal_cate').modal('hide');
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
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
function add() {
    $('#cateid').val(0)
    $('#cate_code_cate').val('');
    $('#cate_name_cate').val('');
    $('#modal_cate').modal('show');
}
function edit(id) {
    var cate = arrCate.find(p => p.cateID == id);
    $('#cateid').val(cate.cateID);
    $('#cate_code_cate').val(cate.cateCode);
    $('#cate_name_cate').val(cate.cateName);
    $('#isdelete_cate').prop('checked', cate.isDelete).trigger('change');
    $('#modal_cate').modal('show');
}
function disableCate(cateID) {
    Swal.fire({
        title: 'Danh mục này đã được sử dụng, chỉ được phép tắt. Bạn muốn tắt không?',
        showDenyButton: true,
        confirmButtonText: 'Yes',

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'admin/categories/disablecate',
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(cateID),  // Gửi roleID để xác định chức vụ cần tắt
                success: function (result) {
                    Swal.fire('Danh mục đã được tắt hoạt động.', '', 'success');
                    GetAll();
                },
                error: function (err) {
                    console.log(err);
                    Swal.fire('Có lỗi xảy ra. Không thể tắt hoạt động danh mục.', '', 'error');
                }
            });
        }
    })

}

function Delete(id) {
    $.ajax({
        url: `/admin/categories/checkUsage?cateId=${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            if (result) {

                disableCate(id);
            } else {
                Swal.fire({
                    title: 'Bạn có chắc muốn xóa danh mục này không?',
                    showDenyButton: true,
                    confirmButtonText: 'Yes',
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '/admin/categories/delete',
                            type: 'DELETE',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            data: JSON.stringify(id),
                            success: function (result) {
                                Swal.fire('Danh mục đã được xóa.', '', 'success');
                                GetAll();
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function onchangeStt(id) {
    // Lấy roleId từ id của checkbox

    // Hiển thị cửa sổ xác nhận
    Swal.fire({
        title: 'Bạn có chắc muốn thay đổi trạng thái không ?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
    }).then((result) => {

        if (result.isConfirmed) {
            // Nếu người dùng xác nhận, gửi yêu cầu AJAX để cập nhật trạng thái hoạt động
            $.ajax({
                url: '/admin/categories/updateStatus',
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(id),
                success: function (result) {
                    Swal.fire('Thay đổi thành công!', '', 'success')
                },
                error: function (err) {
                    Swal.fire('Thay đổi thất bại!', '', 'error')
                }
            });
        } else {
            // Nếu người dùng không xác nhận, thay đổi trạng thái checkbox ngược lại
            $(this).prop('checked', !isDelete);
        }
    });
}