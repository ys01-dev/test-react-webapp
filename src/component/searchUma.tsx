import React from 'react'
import axios from 'axios'
//import {atom, useRecoilState } from 'recoil'
import { Link } from "react-router-dom"
import { targetUrl } from "../common"
import GetUmaHome from './get_uma_home'
import GetUmaDress from './get_uma_dress'
import { chara_name_data as Chara, initCharaNameData } from '../tables/chara_name_data'
import { dress_name_data as Dress, initDressNameData } from '../tables/dress_name_data'
import { umaHome, umamusumeDoc } from '../tables/umamusume'
import { SelectHomePreset } from './selectPreset'
import "../css/css2.css"

const SearchUma = () => {
    const [charaData, setChara] = React.useState<Chara[]>([])
    const [dressData, setDress] = React.useState<Dress[]>([])
    const [searchText, setSearchText] = React.useState<string>("")
    const [targetDBRadio, setDbRadio] = React.useState<string>("character")
    const [preset, setPreset] = React.useState<umaHome[]>([])
    const [selectedReplCharaData, setCharaData] = React.useState<Chara>(initCharaNameData)
    const [selectedDressData, setDressData] = React.useState<Dress>(initDressNameData)
    const [isEnableCharaRepl, setEnableCharaReplCheck] = React.useState<boolean>(true)
    const [isCharaCheck, setCharaCheck] = React.useState<boolean>(true)
    const [isDressCheck, setDressCheck] = React.useState<boolean>(true)
    const [isOriginalCharaCheck, setOriginCharaCheck] = React.useState<boolean>(false)
    const [isModalVisible, setModalVisible] = React.useState(false)
    const setOriginCharaCheck2 = (check: boolean) => {
        setOriginCharaCheck(check)
        setCharaCheck(false)
        setDressCheck(false)
    }

    const targetRadioArr = [{ id: 1, value: "character", checked: true }, { id: 2, value: "dress", checked: false }]
    const optionCheckArr = [{ value: "original character", checked: isOriginalCharaCheck, disable: false, fun: setOriginCharaCheck2 },
    { value: "character", checked: !isOriginalCharaCheck && isCharaCheck, disable: isOriginalCharaCheck, fun: setCharaCheck },
    { value: "dress", checked: !isOriginalCharaCheck && isDressCheck, disable: isOriginalCharaCheck, fun: setDressCheck }]

    const onSearchClick = () => {
        //if(input1.length === 0) return
        switch (targetDBRadio) {
            case "character":
                axios.get(targetUrl + "chara", {
                    params: {
                        charaName: searchText.trim()
                    },
                    timeout: 3000
                }).then(res => {
                    setChara(res.data)
                }).catch(err => {
                    alert(err.response === undefined ? err.message : err.response.data.message)
                })
                break
            case "dress":
                axios.get(targetUrl + "dress", {
                    params: {
                        name: searchText.trim()
                    },
                    timeout: 3000
                }).then(res => {
                    setDress(res.data)
                }).catch(err => {
                    alert(err.response === undefined ? err.message : err.response.data.message)
                })
                break
            default:
                alert("select character or dress radio button first")
                break
        }
    }

    const onJsonClick = () => {
        //const params = new URLSearchParams()
        //params.append("dressId", radio1.trim())        
        axios.post(targetUrl + "homeJson", {
            target: targetDBRadio,
            charaID: selectedReplCharaData.id,
            dressId: selectedDressData.id,
            option: {
                isEnableCharaRepl: isEnableCharaRepl,
                isCharaCheck: isCharaCheck,
                isDressCheck: isDressCheck,
                isOriginalCharaCheck: isOriginalCharaCheck,
            }
        }).then(res => alert(res.data.message)
        ).catch(err => alert(err.response === undefined ? err.message : err.response.data.message))
    }

    const onPresetClick = () => {
        if(!isModalVisible) setModalVisible(true)
        axios.get(targetUrl + "getPreset", {
            params: {
                col: 0,
                query: {}
            },
            timeout: 3000
        }).then(res => {
            setPreset(res.data)
        }).catch(err => {
            alert(err.response === undefined ? err.message : err.response.data.message)
        })
    }

    const onSavePresetClick = () => {
        if(selectedReplCharaData.id === 0 || selectedDressData.id === 0) {
            alert("character or dress isn't selected")
            return
        }

        axios.post(targetUrl + "saveHomePreset", {
            col: umamusumeDoc.uma_home,
            data: {
                charaID: selectedReplCharaData.id,
                charaName: selectedReplCharaData.chara_name,
                dressID: selectedDressData.id,
                dressName: selectedDressData.dress_name,
                dressDesc: selectedDressData.dress_desc
            }
        }).then(res => {
            alert(res.data.message)
        }).catch(err => {
            alert(err.response === undefined ? err.message : err.response.data.message)
        })
    }

    const onApplyPresetClick = (data: umaHome) => {
        selectedReplCharaData.id = data.charaID
        selectedReplCharaData.chara_name = data.charaName
        selectedDressData.id = data.dressID
        selectedDressData.dress_name = data.dressName
        selectedDressData.dress_desc = data.dressDesc
        setModalVisible(false)
    }

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>, from: string) => {
        if (!e.nativeEvent.isComposing && e.key === "Enter") {
            switch (from) {
                case "search":
                    onSearchClick()
                    break
                default: break
            }
        }
    }

    return (
        <div>
            {isModalVisible && (
                <SelectHomePreset presetData={preset} selectedReplCharaData={selectedReplCharaData} selectedDressData={selectedDressData}
                    setModalVisible={setModalVisible} onApplyPresetClick={onApplyPresetClick} onPresetClick={onPresetClick} />
            )}
            <Link to="/live">→LiveChara</Link><br />
            <div className="center">
                <div className="searchArea">
                    <span>search by→</span>
                    {targetRadioArr.map((radio, index) =>
                        <label key={index}>
                            <input type="radio" name="searchRadio" className="searchRadio" defaultChecked={radio.checked} value={`${radio.value}`} onChange={e => setDbRadio(e.target.value)} />
                            {`${radio.value}`}
                        </label>
                    )}
                </div>
                <div>
                    <span>select to change→</span>
                    {optionCheckArr.map((option, index) =>
                        <label key={index}>
                            <input type="checkbox" checked={option.checked} disabled={option.disable} onChange={e => option.fun(e.target.checked)} />
                            {option.value}
                        </label>
                    )}
                </div>
                <div>
                    <input type="text" value={searchText} className="searchTextBox" onKeyDown={e => onEnter(e, "search")} onChange={e => setSearchText(e.target.value)} />
                    <button className="button" onClick={onSearchClick}>search</button>
                    <button onClick={onJsonClick} className="button">json</button>
                </div>
                <div>
                    <label>
                        <input type="checkbox" defaultChecked={isEnableCharaRepl} onChange={e => setEnableCharaReplCheck(e.target.checked)} />
                        enable character replacement
                    </label>
                </div>
                <div>
                    <button className="button" onClick={onPresetClick}>preset</button>
                    <button onClick={onSavePresetClick}>save as preset</button>
                </div>
                <div>
                    <h3 className="title">character</h3>
                    <GetUmaHome setSelectedCharaData={setCharaData} charaData={charaData} radioName="chara" />
                </div>
                <div>
                    <h3 className="title">dress</h3>
                    <GetUmaDress setSelectedDressData={setDressData} dressData={dressData} radioName="dress" />
                </div>
            </div>
            <div className="selected">
                <span className="selectedData">
                    {selectedReplCharaData.id === 0 ? "n/a" : selectedReplCharaData.chara_name}
                    {` : ${selectedDressData.id === 0 ? "n/a" : selectedDressData.dress_name}`}
                    {`(${selectedDressData.dress_desc === "" ? "n/a" : selectedDressData.dress_desc})`}
                </span>
            </div>
        </div>
    )
}

export default SearchUma