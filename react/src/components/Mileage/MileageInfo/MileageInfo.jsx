import styled from "styled-components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import StyleImg1 from "../../../assets/img/bicycleImg.png";
import StyleImg2 from "../../../assets/img/containerImg.png";
import { useNavigate } from "react-router-dom";
import global from "../../../../conf";

const MileageInfo = () => {
  const navi = useNavigate();
  const [selected, setSelected] = useState("bicycle");
  const API_URL = global.API_URL;

  useEffect(() => {
    let apiUrl = "";

    if (selected === "bicycle") {
      apiUrl = `${API_URL}/apis/bicycle`;
    } else if (selected === "container") {
      apiUrl = `${API_URL}/apis/container`;
    }

    axios.get(apiUrl).then((response) => {
      const data =
        selected === "bicycle" ? response.data.stationInfo.row : response.data;
      // console.log(data);

      var mapContainer = document.getElementById("map"),
        mapOption = {
          center: new window.kakao.maps.LatLng(37.566832, 126.978204),
          level: 9,
        };

      var map = new window.kakao.maps.Map(mapContainer, mapOption);

      var imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
      const imageSize = new window.kakao.maps.Size(24, 35);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize
      );

      data.forEach((item) => {
        const lat = selected === "bicycle" ? item.STA_LAT : item.lat;
        const lng = selected === "bicycle" ? item.STA_LONG : item.lot;
        const title = item.RENT_ID_NM;

        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(lat, lng),
          title: title,
          image: markerImage,
        });
        marker.setMap(map);
      });
    });
  }, [selected]);

  return (
    <MileageInfoLayout>
      <InfoTop>
        <TopTitle>탄소 절감을 위해 마일리지를 적립할 수 있는 방법</TopTitle>
        <SectionBox>
          <SectionCard onClick={() => setSelected("bicycle")}>
            <StyleImg src={StyleImg1} alt="자전거 이미지" />
            <p>자전거</p>
          </SectionCard>
          <SectionCard onClick={() => setSelected("container")}>
            <StyleImg src={StyleImg2} alt="다회용기 이미지" />
            <p>다회용기</p>
          </SectionCard>
        </SectionBox>
        <ApplyFormButton onClick={() => navi("/mileage-form")}>
          마일리지 신청하기 ▶
        </ApplyFormButton>
      </InfoTop>

      <MapSection>
        <Map id="map" />
      </MapSection>
    </MileageInfoLayout>
  );
};

export default MileageInfo;

const MileageInfoLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
`;

const InfoTop = styled.div`
  text-align: center;
`;

const TopTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const SectionBox = styled.div`
  display: flex;
  gap: 180px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const SectionCard = styled.div`
  width: 260px;
  height: 260px;
  background: #dcf3b7;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgb(101, 150, 28);
  }
`;

const StyleImg = styled.img`
  width: 120px;
  height: 120px;
  margin-top: 20px;
`;

const ApplyFormButton = styled.button`
  margin: 40px 0;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 16px;
  background: #408c70;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: white;
    color: black;
    border: 1px solid #408c70;
  }
`;

const MapSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  border-radius: 16px;
  border: 3px solid #dcf3b7;
  padding: 20px 0;
`;

const Map = styled.div`
  width: 950px;
  height: 700px;
`;
