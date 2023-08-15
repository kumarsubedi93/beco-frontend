<template>
    <div class="wraper">
        <div class="garbage-flex">
            <template v-if="showCamera">
                <camera @started="handleCameraStarted" @loading="handleCameraLoading"
                    :resolution="{ width: 400, height: 400 }" ref="cameraRef" autoplay>
                </camera>
            </template>
            <template v-else>
                <img v-if="!previewUrl" src="/camera.png" alt="camera icon" />
                <img v-else :src="previewUrl" alt="camera icon" />
            </template>
        </div>

        <div class="click-to-begin">
            <div class="click-begin">
                <template v-if="showCamera && showSnapBtn">
                    <v-btn @click="handleTakeSnapshoot" class="submit-btn" size="large"> Create snapshot !! </v-btn>
                </template>
                <template v-else>
                    <h2> Click To Begin </h2>
                    <v-menu v-if="!loading">
                        <template v-slot:activator="{ props }">
                            <img v-bind="props" src="/start-buttonpng.png"  alt="start button" />
                        </template>
                        <v-list>
                            <v-list-item v-for="(item, index) in photoChoseOptions" :key="index">
                                <v-list-item-title class="pointer-cursor" @click="openFileExploreOrCamera(index)">
                                    {{ item }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </div>
            <input type="file" accept="image/*" ref="fileInput" v-on:change="handleFileInput" class="hidden-file" />
            <h2 v-if="resultTxt" class="font-weight-bold"> The result is : <span style="color: green;"> {{ resultTxt.name }}
                </span>
                <br>
                <span> Total time to get result is: {{ timeTakenby - 0.5 }}s </span>
            </h2>

            <div class="btn">
                <img v-if="loading" src="/VZvw.gif" alt="loading">
                <v-btn v-if="fileValue && !loading" class="submit-btn" @click="handleGetResult" size="large"> Submit
                </v-btn>
            </div>


            <p class="mt-7"> This app identifies if an item can be accepted by the Blue Bin / Bloobox. </p>
            <p class="mt-7">For best results, please take photo of one item at a time against plain background </p>
        </div>

        <div class="footer mt-10">
            <p> Copyright © 2023 Beco. All Rights Reserved. </p>
        </div>
    </div>
</template>

<script setup>
import Camera from "simple-vue-camera";
import imageCompression from 'browser-image-compression';

import { ref } from 'vue';
import axios from 'axios';
const fileInput = ref(null)
const previewUrl = ref(null)
const fileValue = ref(null)
const resultTxt = ref(null)
const timeTakenby = ref(null)
const loading = ref(false)
const showCamera = ref(false)
const cameraRef = ref();
const showSnapBtn = ref(false)
const loadingCamera = ref(false)
const photoChoseOptions = ref([
    'Photo Library',
    'Take Photo'
])

const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

const resetAllValues = () => {
    previewUrl.value = null
    fileValue.value = null
    resultTxt.value = null
    loadingCamera.value = false
    showSnapBtn.value = false
}

const handleCameraStarted = () => {
    showSnapBtn.value = true
    loadingCamera.value = false
}

const handleCameraLoading = () => {
    loadingCamera.value = true
}

const handleTakeSnapshoot = async () => {
    const blob = await cameraRef.value?.snapshot(
        { width: 400, height: 400 },
        "image/png",
        1
    )
    const url = URL.createObjectURL(blob);
    previewUrl.value = url
    fileValue.value = blob
    showCamera.value = false
}


const handleFileInput = async (e) => {
    const file = e.target.files[0]
    await handleCompressImage(file)
}

const openFileExploreOrCamera = (key) => {
    if (key == 1) {
        resetAllValues()
        showCamera.value = true
    } else {
        fileInput.value.click()
    }
}

const handleGetResult = () => {
    if (!fileValue) return;
    const url = "/api/uploads"
    const form = new FormData()
    form.append('image', fileValue.value)
    const startTime = new Date();
    loading.value = true
    axios.post(url, form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        timeTakenby.value = timeTaken
        const result = mapJsonOutput(res.data.results)
        resultTxt.value = result[0]
        loading.value = false
    }).catch(err => {
        loading.value = false
    })
}

const mapJsonOutput = (result) => {
    const maps = ['Ewaste', 'Glass', 'Metal', 'NonRecyclable', 'Paper', 'Plastic']
    const newResult = result.map((item, key) => {
        return {
            name: maps[key],
            value: item
        }
    })
    return newResult.sort((a, b) => {
        if (a.value > b.value) {
            return -1
        }
        return 1
    })
}

const handleCompressImage = async (file) => {
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
    }
    const compressedFile = await imageCompression(file, options);
    const result = URL.createObjectURL(compressedFile);
    previewUrl.value = result
    fileValue.value = compressedFile
}


</script>

<style scoped>
.submit-btn {
    background: #60d937;
    color: #fff;
}

.hidden-file {
    display: none;
}

.wraper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.garbage-flex img {
    max-width: 100%;
    width: 400px;
}

h4.text-title {
    color: #5e5e5e;
    text-align: center;
}

p.text-tiny {
    color: #000;
    font-size: 14px;
}

.click-to-begin h2 {
    margin-bottom: 0;
    font-size: 21px;
    color: #000;
}

.click-to-begin {
    text-align: center;
}

.click-to-begin p {
    font-size: 14px;
}

.click-to-begin img {
    max-width: 70px;
    cursor: pointer;
}

.click-to-begin svg {
    font-size: 40px;
    fill: #555;
}

.social-icons svg {
    fill: #637fb0;
    font-size: 34px;
    margin: 0px 15px 15px 15px;
}

.pointer-cursor{
    cursor: pointer;
}
</style>