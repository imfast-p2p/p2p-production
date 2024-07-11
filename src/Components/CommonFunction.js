import { BASEURL } from "./assets/baseURL";

export const getProductList = async () => {
    try {
        const response = await fetch(BASEURL + '/lsp/getloanproductlist', {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token'),
            }
        });
        const resdata = await response.json();

        if (resdata.status === 'SUCCESS') {
            console.log(resdata);
            return resdata; // Return the entire response data if needed
        } else {
            alert("Issue: " + resdata.message);
            return resdata;
        }
    } catch (error) {
        console.log(error);
        throw error; // Rethrow the error if needed
    }
};



export const getAssociatedPermissions= async()=>{
    try{
        const response = await fetch(BASEURL + '/usrmgmt/getassociatedpermissions', {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token'),
            }
        });
        const resdata = await response.json();
        if (resdata.status === 'SUCCESS'||'Success'||'success') {
            console.log(resdata);
            return resdata; // Return the entire response data if needed
        } else {
            alert("Issue: " + resdata.message);
            return resdata;
        }
    }
    catch (error) {
        console.log(error);
        throw error; // Rethrow the error if needed
    }

}