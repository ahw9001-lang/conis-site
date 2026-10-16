---
title: IFC에서 정보통신설비는 어떻게 표현될까
date: 2026-10-16
category: BIM · IFC
summary: 통신장비, 케이블, 케이블트레이, 인출구까지. 정보통신설비를 IFC로 옮길 때 먼저 알아야 할 엔티티를 정리합니다.
tags:
  - IFC4
  - 엔티티
draft: false
---

## 들어가며

정보통신설비 현장에서는 장비 목록, 배선 도면, 점검 사진이 서로 다른 파일로 관리되는 경우가 많습니다. 이 기록들을 하나의 모델로 묶으려면 먼저 IFC가 각 설비를 어떤 객체로 표현하는지 알아야 합니다.

## 주요 엔티티

IFC4 기준으로 정보통신설비와 직접 관련된 엔티티는 아래와 같습니다. 각 엔티티는 PredefinedType으로 세부 종류를 구분합니다.

| 엔티티 | 대상 | PredefinedType 예 |
| --- | --- | --- |
| `IfcCommunicationsAppliance` | 통신장비 | ROUTER, MODEM, NETWORKHUB, ANTENNA |
| `IfcCableSegment` | 케이블 | CABLESEGMENT, CORESEGMENT |
| `IfcCableCarrierSegment` | 케이블트레이 · 전선관 | CABLETRAYSEGMENT, CONDUITSEGMENT |
| `IfcOutlet` | 인출구 | DATAOUTLET, TELEPHONEOUTLET |

## STEP 파일에서 보기

IFC 파일을 텍스트 편집기로 열면 객체가 한 줄씩 기록되어 있습니다. 예를 들어 데이터 인출구 하나는 다음처럼 표현됩니다.

```
#120= IFCOUTLET('0aB3cD4eF5gH6iJ7kL8mN9',#5,'TO-301',
  $,$,#130,#140,$,.DATAOUTLET.);
```

마지막 값 `.DATAOUTLET.`이 이 인출구가 데이터용임을 알려 줍니다. 설비 번호 'TO-301'은 Name으로 들어가 현장 기록과 연결하는 열쇠가 됩니다.

## 점검기록과 연결하기

객체가 정해지면 다음은 속성입니다. 점검일, 점검자, 판정, 증빙 사진의 위치 같은 값을 속성세트로 붙이면, 준공 후 유지보수 단계에서도 설비 단위로 기록을 찾아볼 수 있습니다.

> 어떤 속성이 반드시 있어야 하는지는 IDS로 정의하고 검증할 수 있습니다. 이 부분은 다음 글에서 이어 다룹니다.

## 정리

정보통신설비를 IFC로 다룰 때는 엔티티와 PredefinedType으로 '무엇인지'를, 속성세트로 '어떤 상태인지'를 표현합니다. 이 두 가지가 갖춰지면 흩어진 현장 기록을 설비 하나에 모을 수 있습니다.
