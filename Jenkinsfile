pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'geolab/estoque-toner:latest'
        CONTAINER_NAME = 'estoque-toner'
    }

    stages {
        stage('Clonar repositório') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker') {
            steps {
                echo "Construindo imagem Docker..."
                dir('backend') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Executando script de deploy..."
                sh 'chmod +x jenkins/deploy.sh'
                sh './jenkins/deploy.sh'
            }
        }
    }

    post {
        success {
            echo "✅ Deploy realizado com sucesso!"
        }
        failure {
            echo "❌ Erro ao realizar o deploy."
        }
    }
}
