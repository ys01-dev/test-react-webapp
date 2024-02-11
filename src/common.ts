//import React from 'react'
import axios from 'axios'

export const targetUrl = "http://192.168.11.2:4000/"

export const getCharaData = (param: {}): Promise<any> => {
    return new Promise<any>((resolve, rejects) => {
        axios.get(targetUrl + "chara", {
            params: param,
            timeout: 3000,
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })        
    })
}

export const getDressData = (param: {}): Promise<any> => {
    return new Promise<any>((resolve, rejects) => {
            axios.get(targetUrl + "dress", {
            params: param,
            timeout: 3000,
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}

export const changeConfig = (url: string, param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.post(targetUrl + url, param
        ).then(res => resolve(res.data.message)
        ).catch(err => rejects(err.response === undefined ? err.message : err.response.data.message))
    })
}

export const getPreset = (param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.get(targetUrl + "getPreset", {
            params: param,
            timeout: 3000
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}

export const savePreset = (url: string, param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.post(targetUrl + url, param).then(res => {
            resolve(res.data.message)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}

export const updatePreset = (url: string, param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.patch(targetUrl + url, param).then(res => {
            resolve(res.data.message)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}

export const deletePreset = (param: {}) => {
    return new Promise<any>((resolve, rejects) => {
        axios.delete(targetUrl + "deletePreset", { data: param }).then(res => {
            resolve(res.data.message)
        }).catch(err => {
            rejects(err.response === undefined ? err.message : err.response.data.message)
        })
    })
}