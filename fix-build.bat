@echo off
echo Cleaning Android build...

cd android
call gradlew clean
cd ..

echo Deleting cache folders...
rmdir /s /q android\app\.cxx
rmdir /s /q android\app\build
rmdir /s /q android\.gradle
rmdir /s /q %USERPROFILE%\.gradle\caches\transforms-3
rmdir /s /q %USERPROFILE%\.gradle\caches\8.14.3

echo Stopping Gradle daemon...
cd android
call gradlew --stop
cd ..

echo Reinstalling dependencies...
rmdir /s /q node_modules
call npm install

echo Starting Metro bundler...
start cmd /k npx react-native start --reset-cache

echo.
echo Wait for Metro to finish loading, then press any key to build...
pause

echo Building Android app...
call npx react-native run-android
