import React from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"
import GetUmaHome from './get_uma_home'
import GetUmaDress from './get_uma_dress'
import { chara_name_data as Chara, initCharaNameData } from '../tables/chara_name_data'
import { dress_name_data as Dress, initDressNameData } from '../tables/dress_name_data'
import { initUmaLiveChara, umaLive, umaLiveChara, umamusumeDoc } from '../tables/umamusume'
import { SelectLivePreset } from './selectPreset'
import "../css/css2.css"

const SearchUma2 = () => {
    const targetUrl = "http://192.168.11.2:4000/"
    const [searchText, setSearchText] = React.useState<string>("")
    const [targetDBRadio, setDbRadio] = React.useState<string>("character")
    const [originalCharaData, setOriginalChara] = React.useState<Chara[]>([])
    const [replCharaData, setReplChara] = React.useState<Chara[]>([])
    const [dressData, setDress] = React.useState<Dress[]>([])
    const [selectedOriginalChara, setSelectedOriginalChara] = React.useState<Chara>({...initCharaNameData})
    const [selectedReplChara, setSelectedReplChara] = React.useState<Chara>({...initCharaNameData})
    const [selectedDress, setSelectedDress] = React.useState<Dress>({...initDressNameData})
    const [preset, setPreset] = React.useState<umaLive[]>([])
    const [liveChara1, setLiveChara1] = React.useState<umaLiveChara>({...initUmaLiveChara})
    const [liveChara2, setLiveChara2] = React.useState<umaLiveChara>({...initUmaLiveChara})
    const [liveChara3, setLiveChara3] = React.useState<umaLiveChara>({...initUmaLiveChara})
    const [liveChara4, setLiveChara4] = React.useState<umaLiveChara>({...initUmaLiveChara})
    const [liveChara5, setLiveChara5] = React.useState<umaLiveChara>({...initUmaLiveChara})
    const [selectedLiveCharaRadio, setSelectedLiveCharaRadio] = React.useState<number>(-1)
    //const [selectedLiveChara, setSelectedLiveChara] = React.useState<umaLiveChara>({...initUmaLiveChara})
    const [isEnableCharaRepl, setEnableCharaReplCheck] = React.useState<boolean>(true)
    const [liveCharaStateFunc, setLiveCharaStateFunc] = React.useState<React.Dispatch<React.SetStateAction<umaLiveChara>>>(() => setLiveChara1)
    const [isModalVisible, setModalVisible] = React.useState(false)
    const searchRadio = [{value: "character", checked: true}, {value: "dress", checked: false}]
    const liveCharaRadioArr = [{liveChara: liveChara1, checked: true, fun: setLiveChara1}, {liveChara: liveChara2, checked: false, fun: setLiveChara2},
                                {liveChara: liveChara3, checked: false, fun: setLiveChara3}, {liveChara: liveChara4, checked: false, fun: setLiveChara4},
                                {liveChara: liveChara5, checked: false, fun: setLiveChara5}]
    const setLiveCharaArr = [setLiveChara1, setLiveChara2, setLiveChara3, setLiveChara4, setLiveChara5]

    const onSearchClick = () => {
        switch (targetDBRadio) {
            case "character":
                axios.get(targetUrl + "chara", {
                    params: {
                        charaName: searchText.trim()
                    },
                    timeout: 3000,
                }).then(res => {
                    setOriginalChara(res.data)
                    setReplChara(res.data)
                }).catch(err => {
                    alert(err.response === undefined ? err.message : err.response.data.message)
                })        
                break
            case "dress":
                axios.get(targetUrl + "dress", {
                    params: {
                        name: searchText.trim()
                    },
                    timeout: 3000,
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
        axios.post(targetUrl + "liveJson", {
            liveCharas: [
                {origCharId: liveChara1.originalCharaID, newChrId: liveChara1.replCharaID, newClothId: liveChara1.dressID},
                {origCharId: liveChara2.originalCharaID, newChrId: liveChara2.replCharaID, newClothId: liveChara2.dressID},
                {origCharId: liveChara3.originalCharaID, newChrId: liveChara3.replCharaID, newClothId: liveChara3.dressID},
                {origCharId: liveChara4.originalCharaID, newChrId: liveChara4.replCharaID, newClothId: liveChara4.dressID},
                {origCharId: liveChara5.originalCharaID, newChrId: liveChara5.replCharaID, newClothId: liveChara5.dressID}
            ],
            option: {
                isEnableCharaRepl: isEnableCharaRepl
            }
        }).then(res => alert(res.data.message)
        ).catch(err => alert(err.response.data.message))
    }

    const onPresetClick = () => {
        if(!isModalVisible) setModalVisible(true)
        axios.get(targetUrl + "getPreset", {
            params: {
                col: umamusumeDoc.uma_live,
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
        axios.post(targetUrl + "saveLivePreset", {
            col: umamusumeDoc.uma_live,
            data: [liveChara1, liveChara2, liveChara3, liveChara4, liveChara5]
        }).then(res => {
            alert(res.data.message)
        }).catch(err => {
            alert(err.response === undefined ? err.message : err.response.data.message)
        })
    }

    const onApplyPresetClick = (preset: umaLive) => {
        setLiveCharaArr.map((fun, index) => fun({...preset.data[index]}))
        onChangeliveCharaRadio(preset.data[0], setLiveChara1, 0)
        setModalVisible(false)
    }

    const onChangeliveCharaRadio = (data: umaLiveChara, fun: React.Dispatch<React.SetStateAction<umaLiveChara>>, id: number) => {
        let tmpOrg = {...initCharaNameData}
        let tmpRpl = {...initCharaNameData}
        let tmpDrs = {...initDressNameData}

        setSelectedLiveCharaRadio(id)
        //setSelectedLiveChara({...data})
        setLiveCharaStateFunc(() => fun)

        tmpOrg.id = data.originalCharaID
        tmpOrg.chara_name = data.originalCharaName
        setSelectedOriginalChara(tmpOrg)

        tmpRpl.id = data.replCharaID
        tmpRpl.chara_name = data.replCharaName
        setSelectedReplChara(tmpRpl)

        tmpDrs.id = data.dressID
        tmpDrs.dress_name = data.dressName
        setSelectedDress(tmpDrs)
    }

    const onAddButton = () => {
        let tmp = {...initUmaLiveChara}
        tmp.originalCharaID = selectedOriginalChara.id
        tmp.originalCharaName = selectedOriginalChara.chara_name
        tmp.replCharaID = selectedReplChara.id
        tmp.replCharaName = selectedReplChara.chara_name
        tmp.dressID = selectedDress.id
        tmp.dressName = selectedDress.dress_name
        liveCharaStateFunc(tmp)
    }

    const onRemoveButton = () => {
        if(selectedLiveCharaRadio >= 0) setLiveCharaArr[selectedLiveCharaRadio]({...initUmaLiveChara})
    }

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!e.nativeEvent.isComposing && e.key === "Enter") onSearchClick()
    }

    return(
        <div>
            {isModalVisible && (
                <SelectLivePreset presetData={preset} selectedLiveCharaArr={[liveChara1, liveChara2, liveChara3, liveChara4, liveChara5]}
                    setModalVisible={setModalVisible} onApplyPresetClick={onApplyPresetClick} onPresetClick={onPresetClick} />
            )}
            <Link to="/home">→HomeChara</Link>
            <div className="center">
                <div>
                    {liveCharaRadioArr.map((radio, index) =>
                        <div key={index}>
                            <label key={index}>
                                <input type="radio" name="liveChara" defaultChecked={radio.checked} onClick={() => onChangeliveCharaRadio(radio.liveChara, radio.fun, index)} />
                                {`${index}
                                ${radio.liveChara.originalCharaID + ":" + (radio.liveChara.originalCharaName.length === 0 ? "n/a" : radio.liveChara.originalCharaName)}
                                → ${radio.liveChara.replCharaID + ":" + (radio.liveChara.replCharaName.length === 0 ? "n/a" : radio.liveChara.replCharaName)}
                                (${radio.liveChara.dressID + ":" + (radio.liveChara.dressName.length === 0 ? "n/a" : radio.liveChara.dressName)})`}
                            </label>
                        </div>
                    )}
                    <button className="button" onClick={onAddButton}>add</button>
                    <button onClick={onRemoveButton}>remove</button>
                </div>
                <div>
                    <span>search by→</span>
                    {searchRadio.map((radio, index) =>
                        <label key={index}>
                            <input type="radio" name="searchRadio" className="searchRadio" defaultChecked={radio.checked} value={`${radio.value}`} onChange={e => { setDbRadio(e.target.value) }} />
                            {`${radio.value}`}
                        </label>
                    )}
                </div>
                <div>
                    <input type="text" value={searchText} className="searchTextBox" onKeyDown={onEnter} onChange={e => setSearchText(e.target.value)} />
                    <button className="button" onClick={onSearchClick}>search</button>
                    <button onClick={onJsonClick} className="button">json</button>
                </div>
                <div>
                    <label><input type="checkbox" defaultChecked={isEnableCharaRepl} onChange={e => setEnableCharaReplCheck(e.target.checked)} />
                        enable character replacement
                    </label>
                </div>
                <div>
                    <button className="button" onClick={onPresetClick}>preset</button>
                    <button onClick={onSavePresetClick}>save as preset</button>
                </div>
                <div>
                    <h3 className="title">original character</h3>
                    <GetUmaHome setSelectedCharaData={setSelectedOriginalChara} charaData={originalCharaData} radioName="original" key={"original"} />
                </div>
                <div>
                    <h3 className="title">replacement character</h3>
                    <GetUmaHome setSelectedCharaData={setSelectedReplChara} charaData={replCharaData} radioName="chara" key={"replace"} />
                </div>
                <div>
                    <h3 className="title">dress</h3>
                    <GetUmaDress setSelectedDressData={setSelectedDress} dressData={dressData} radioName="dress" key={"dress"} />
                </div>
            </div>
            <div className="selected">
                <span className="selectedData">
                    {selectedOriginalChara.id === 0 ? "n/a" : selectedOriginalChara.chara_name}
                    {" → "}
                    {selectedReplChara.id === 0 ? "n/a" : selectedReplChara.chara_name}
                    {` : ${selectedDress.id === 0 ? "n/a" : selectedDress.dress_name}`}
                </span>
            </div>
        </div>
    )
}

export default SearchUma2