pipeline {
    agent none

    parameters {
        string(defaultValue: "0.0", description: 'Build version prefix', name: 'BUILD_VERSION_PREFIX')
        string(defaultValue: "", description: 'Build number offset', name: 'BUILDS_OFFSET')
    }

    stages {
        stage('Prepare env') {
            agent {
                label 'master'
            }

            steps {
                script {
                    loadLibrary()
                    env['NPM_VERSION_NUMBER'] = getNpmVersion 'kurlytail/sgen-bot/master', params.BUILD_VERSION_PREFIX, params.BUILDS_OFFSET
                    currentBuild.displayName = env['NPM_VERSION_NUMBER']
                }
            }
        }

        stage ('NPM Build') {
            agent {
                label 'node-build'
            }

            steps {
                sh 'rm -rf *'

                checkout scm

                nodejs(nodeJSInstallationName: 'Node') {
                    sh 'npm install --no-save'
                    sh 'npm version $NPM_VERSION_NUMBER'
                    sh 'npm run lint'
                    sh 'npm run build'
                    #sh 'npm publish'
                }
            }
        }
    }
}
