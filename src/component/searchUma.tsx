import React, { useState } from 'react'
//import {atom, useRecoilState } from 'recoil'
import { useSelector } from "react-redux";
import { getCharaData, getDressData, changeConfig, getPreset, savePreset } from "../common"
import GetUmaHome from './get_uma_home'
import GetUmaDress from './get_uma_dress'
import { chara_name_data as Chara, initCharaNameData } from '../tables/chara_name_data'
import { dress_name_data as Dress, initDressNameData } from '../tables/dress_name_data'
import { umaHome, umamusumeDoc } from '../tables/umamusume'
import { SelectHomePreset } from './selectPreset'
import "../css/searchUma.css"

const SearchUma = () => {
    //#region const declaration
    const strOrgChara = "original"
    const strReplace = "replace"
    const strDress = "dress"
    const sideBarWidth = useSelector<any, number>(state => state.sideBar.width)
    const [originalCharaData, setOrgCharaData] = React.useState<Chara[]>([])
    const [charaData, setCharaData] = React.useState<Chara[]>([])
    const [dressData, setDressData] = React.useState<Dress[]>([])
    const [searchTextChara, setSearchTextChara] = React.useState("")
    const [searchTextOriginChara, setSearchTextOriginChara] = React.useState("")
    const [searchTextDress, setSearchTextDress] = React.useState("")
    const [preset, setPreset] = React.useState<umaHome[]>([])
    const [selectedOrgCharaData, setSelectedOrgCharaData] = React.useState<Chara>(initCharaNameData)
    const [selectedReplCharaData, setSelectedCharaData] = React.useState<Chara>(initCharaNameData)
    const [selectedDressData, setSelectedDressData] = React.useState<Dress>(initDressNameData)
    const [isEnableCharaRepl, setEnableCharaReplCheck] = React.useState(true)
    const [isOriginalCharaCheck, setOriginCharaCheck] = React.useState(false)
    const [isModalVisible, setModalVisible] = React.useState(false)
    const [resAreaOrgCharaVisible, setResAreaOrgCharaVisible] = useState(true)
    const [resAreaRplCharaVisible, setresAreaRplCharaVisible] = useState(true)
    const [resAreaDressVisible, setresAreaDressVisible] = useState(true)
    //#endregion

    //#region fun declaration
    const onSearchClick = async (from: string) => {
        try {
            switch (from) {
                case strOrgChara:
                    setOrgCharaData(await getCharaData({ charaName: searchTextOriginChara.trim() }))
                    break
                case strReplace:
                    setCharaData(await getCharaData({ charaName: searchTextChara.trim() }))
                    break
                case strDress:
                    setDressData(await getDressData({ name: searchTextDress.trim() }))
                    break
                default:
                    alert("select character or dress radio button first")
                    break
            }
        } catch (err: any) {
            alert(err)
        }
    }

    const onApplyChangesClick = async () => {
        let ret
        try {
            ret = await changeConfig("homeJson", {
                orgCharaID: selectedOrgCharaData.id,
                charaID: selectedReplCharaData.id,
                dressId: selectedDressData.id,
                option: {
                    isEnableCharaRepl: isEnableCharaRepl,
                    isOriginalCharaCheck: isOriginalCharaCheck,
                }
            })
        } catch (err) {
            ret = err
        }
        alert(ret)
    }

    const onPresetClick = async () => {
        if (!isModalVisible) setModalVisible(true)
        try {
            setPreset(await getPreset({ col: 0, query: {} }))
        } catch (err) {
            alert(err)
        }
        return 1
    }

    const onSavePresetClick = async () => {
        if (selectedReplCharaData.id === 0 || selectedDressData.id === 0) {
            alert("character or dress isn't selected")
            return
        }
        let ret

        try {
            ret = await savePreset("saveHomePreset", {
                col: umamusumeDoc.uma_home,
                data: {
                    charaID: selectedReplCharaData.id,
                    charaName: selectedReplCharaData.chara_name,
                    dressID: selectedDressData.id,
                    dressName: selectedDressData.dress_name,
                    dressDesc: selectedDressData.dress_desc
                }
            })
        } catch (err) {
            ret = err
        }
        alert(ret)
    }

    const onApplyPresetClick = (data: umaHome) => {
        let tmp = { ...selectedReplCharaData }
        tmp.id = data.charaID
        tmp.chara_name = data.charaName
        setSelectedCharaData({ ...tmp })

        let tmp2 = { ...selectedDressData }
        tmp2.id = data.dressID
        tmp2.dress_name = data.dressName
        tmp2.dress_desc = data.dressDesc
        setSelectedDressData({ ...tmp2 })

        setModalVisible(false)
    }

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>, from: string) => {
        if (!e.nativeEvent.isComposing && e.key === "Enter") onSearchClick(from)
    }
    //#endregion

    return (
        <div className="searchUma">
            {isModalVisible && (
                <SelectHomePreset presetData={preset} selectedReplCharaData={selectedReplCharaData} selectedDressData={selectedDressData}
                    setModalVisible={setModalVisible} onApplyPresetClick={onApplyPresetClick} onPresetClick={onPresetClick} />
            )}
            <div className="selected">
                <span className="selectedData">
                    {selectedOrgCharaData.id !== 0 && isOriginalCharaCheck && (
                        <span>
                            {selectedOrgCharaData.id === 0 ? "" : selectedOrgCharaData.chara_name}<br />
                            ↓<br />
                        </span>
                    )}
                    {selectedReplCharaData.id === 0 ? "n/a" : selectedReplCharaData.chara_name}
                    {` : ${selectedDressData.id === 0 ? "n/a" : selectedDressData.dress_name}`}
                    {`(${selectedDressData.dress_desc === "" ? "n/a" : selectedDressData.dress_desc})`}
                </span>
            </div>
            <button onClick={onApplyChangesClick} className="btnApplyChanges">apply</button>
            <div style={{ marginLeft: (sideBarWidth === 0 ? 70 : 40) + "px" }}>
                <div className="options">
                    <div>
                        <label>
                            <input type="checkbox" defaultChecked={isEnableCharaRepl} onChange={e => setEnableCharaReplCheck(e.target.checked)} />
                            enable character replacement
                        </label><br />
                        <label>
                            <input type="checkbox" onChange={e => setOriginCharaCheck(!isOriginalCharaCheck)} />
                            replace original character
                        </label>
                    </div>
                    <div>
                        <button onClick={onPresetClick}>preset</button>
                        <button onClick={onSavePresetClick}>save as preset</button>
                    </div>
                </div>
                <div className="resultOrgCharaContainer" style={{ display: isOriginalCharaCheck ? "block" : "none" }}>
                    <h3 className="title" onClick={() => setResAreaOrgCharaVisible(!resAreaOrgCharaVisible)}>original character</h3>
                    <div style={{ display: resAreaOrgCharaVisible ? "block" : "none" }}>
                        <div>
                            <input type="text" value={searchTextOriginChara} className="searchTextBox" onKeyDown={e => onEnter(e, strOrgChara)} onChange={e => setSearchTextOriginChara(e.target.value)} />
                            <button onClick={() => onSearchClick(strOrgChara)}>search</button>
                        </div>
                        <GetUmaHome setSelectedCharaData={setSelectedOrgCharaData} charaData={originalCharaData} radioName={strOrgChara} />
                    </div>
                </div>
                <div className="resultCharaContainer">
                    <h3 className="title" onClick={() => setresAreaRplCharaVisible(!resAreaRplCharaVisible)}>
                        replacement character
                    </h3>
                    <div style={{ display: resAreaRplCharaVisible ? "block" : "none" }}>
                        <div>
                            <input type="text" value={searchTextChara} className="searchTextBox" onKeyDown={e => onEnter(e, strReplace)} onChange={e => setSearchTextChara(e.target.value)} />
                            <button onClick={() => onSearchClick(strReplace)}>search</button>
                        </div>
                        <GetUmaHome setSelectedCharaData={setSelectedCharaData} charaData={charaData} radioName={strReplace} />
                    </div>
                </div>
                <div className="resultDressContainer">
                    <h3 className="title" onClick={() => setresAreaDressVisible(!resAreaDressVisible)}>
                        dress
                    </h3>
                    <div style={{ display: resAreaDressVisible ? "block" : "none" }}>
                        <div>
                            <input type="text" value={searchTextDress} className="searchTextBox" onKeyDown={e => onEnter(e, strDress)} onChange={e => setSearchTextDress(e.target.value)} />
                            <button onClick={() => onSearchClick(strDress)}>search</button>
                        </div>
                        <GetUmaDress setSelectedDressData={setSelectedDressData} dressData={dressData} radioName={strDress} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchUma