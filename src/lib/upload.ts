export const uploadToCloudinary = async (file: File) => {

    if (file === undefined) {
        return;
    }

    console.log('uploading this pic : ', file)

    if (file.type === "application/pdf") {
        const data = new FormData();

        data.append("file", file);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dex1j2qai");

        const uploaded = await fetch("https://api.cloudinary.com/v1_1/dex1j2qai/raw/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then((data) => {
                console.log("this : ", data)
                return data;
            }).catch(err => {
                console.log("error in documents upload : ", err)
            })

        return uploaded
    } else {
        return;
    }
}
