import React, { useState, useEffect, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import SportApp from "../../API/SportApp";
import { AuthImage } from "react-auth-image";
import styles from "./TraningImages.module.css";
import { FileUpload } from "primereact/fileupload";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { BASE_URL } from "../../config";
import Loader from "../Loader/Loader";


function TraningImages({ trImages, trId }) {
    const token = Cookies.get("token");
    const [traningImages, setTraningImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(null); // Для хранения выбранного изображения для удаления
    const [loaderImageUpload, setLoaderImageUpload] = useState(false)
    const toast = useRef(null);

    useEffect(() => {
        setTraningImages(trImages);
    }, [trImages]);

    async function removeImage() {
        if (imageToDelete) {
            try {
                const response = await SportApp.remove_image(imageToDelete.id, token);
                console.log(response);
                const tempImages = traningImages.filter((i) => i.id !== response.data.success_remove.id);
                setTraningImages(tempImages);
                toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Изображение удалено', life: 3000 });
            } catch (e) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить изображение', life: 3000 });
            } finally {
                setImageToDelete(null); // Закрыть модальное окно после завершения
            }
        }
    }

    function openImage(src) {
        setSelectedImage(src);
    }

    function closeImage() {
        setSelectedImage(null);
    }

    async function imageUploader(images) {
        setLoaderImageUpload(true);
        const formData = new FormData();
        formData.append('body', "b");
        formData.append('item_id', trId);
        images.files.forEach((file) => {
            formData.append(`images`, file);
        });
        try {
            const response = await SportApp.upload_images(formData, token);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Изображение добавлено', life: 3000 });
            images.options.clear();
            setTraningImages([...traningImages, ...response.data.success_add]);
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить изображение', life: 3000 });
        } finally {
            setLoaderImageUpload(false);
        }
    }

    const imageElements = useMemo(() => (
        traningImages.map((image) => (
            <div key={image.id} className={styles.imageCard}>
                <div className={styles.removeButton} onClick={() => setImageToDelete(image)}>
                    &times;
                </div>
                <AuthImage
                    className={styles.image}
                    src={`${BASE_URL}/images/${image.title}`}
                    token={token}
                    errorCallback={() => { }}
                    onClick={() => openImage(`${BASE_URL}/images/${image.title}`)}
                />
            </div>
        ))
    ), [traningImages, token]);

    return (
        <div>
            <Toast ref={toast} position="top-center"></Toast>
            <div className={styles.container}>
                {imageElements}
            </div>

            {selectedImage && (
                <div className={styles.modal} onClick={closeImage}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <AuthImage
                            className={styles.modalImage}
                            src={selectedImage}
                            token={token}
                            errorCallback={() => { }}
                        />
                        <button className={styles.closeModal} onClick={closeImage}>✖</button>
                    </div>
                </div>
            )}

            <div className={styles.uploadButtonContainer}>
                {loaderImageUpload ? <Loader /> : <FileUpload
                    auto
                    mode="basic"
                    customUpload
                    uploadHandler={imageUploader}
                    multiple
                    accept="image/*"
                    maxFileSize={3000000}
                    chooseLabel="Загрузить изображения"
                />}
            </div>

            {/* Модальное окно для подтверждения удаления */}
            <Dialog
                header="Подтверждение удаления"
                visible={!!imageToDelete}
                style={{ width: '350px' }}
                footer={
                    <div>
                        <Button label="Отмена" icon="pi pi-times" onClick={() => setImageToDelete(null)} className="p-button-text" />
                        <Button label="Удалить" icon="pi pi-check" onClick={removeImage} className="p-button-danger" />
                    </div>
                }
                onHide={() => setImageToDelete(null)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem' }} />
                    <span>Вы уверены, что хотите удалить это изображение?</span>
                </div>
            </Dialog>
        </div>
    );
}

export default TraningImages;
