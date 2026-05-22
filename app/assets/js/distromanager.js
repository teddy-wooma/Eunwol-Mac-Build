const { DistributionAPI } = require('helios-core/common')

const ConfigManager = require('./configmanager')

// Old WesterosCraft url.
// exports.REMOTE_DISTRO_URL = 'http://mc.westeroscraft.com/WesterosCraftLauncher/distribution.json'
exports.REMOTE_DISTRO_URL = 'https://teddy-wooma.github.io/luna-eunwol-launcher/distribution.json'

const api = new DistributionAPI(
    ConfigManager.getLauncherDirectory(),
    null, // Injected forcefully by the preloader.
    null, // Injected forcefully by the preloader.
    exports.REMOTE_DISTRO_URL,
    false
)

/**
 * [정석 무결성 검사 예외 등록 함수]
 * 최초 1회 실행 시: 유저 컴퓨터에 파일이 없으므로 서버에서 정상 다운로드합니다.
 * 2회 실행부터: 파일이 이미 존재하므로, 서버 원본과 해시값이 달라도 무결성 검사를 '패스'하여 유저 세팅을 유지합니다.
 */
api.isUserFile = function(relativeStructurePath) {
    // 경로 구분을 명확히 하기 위해 소문자로 치환합니다.
    const path = relativeStructurePath.toLowerCase()

    // 예외 처리할 파일 및 폴더 목록 정의
    if (path.includes('options.txt') ||
        path.includes('servers.dat') ||
        path.includes('feather') ||
        path.includes('config')) {
        return true // "이 파일은 유저 고유 파일이니 덮어쓰지 마라"고 런처에 신호를 보냅니다.
    }

    // 모드(Mods) 등 다른 중요 파일들은 평소대로 무결성 검사를 진행해 자동 복구/업데이트를 적용합니다.
    return false
}

exports.DistroAPI = api