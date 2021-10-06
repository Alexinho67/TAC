import sys
from random import random
from random import seed
import time
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from random import seed
from random import random

ZOOMFACTOR = 55

# seed random number generator
seed(1)

def clickElem(drvr, el):
    drvr.execute_script("arguments[0].click();", el)

def dblClickElem(drvr, el):
    drvr.execute_script("arguments[0].dbclick();", el)

def createNewGame(driver, name):
    global idGame
    global ZOOMFACTOR   
    actions = ActionChains(driver)
    driver.get(url_0)
    time.sleep(2)

    # driver.execute_script(f"document.body.style.zoom='50%'")
    changeZoom(driver, ZOOMFACTOR)
    htlmElm = driver.find_element_by_tag_name('html')
    htlmElm.send_keys(Keys.CONTROL, '-')

    inputUserName = driver.find_element_by_id('userName')
    inputUserName.clear()
    inputUserName.send_keys(name)

    selectNrPlayer = Select(driver.find_element_by_id('nrPlayer'))
    selectNrPlayer.select_by_index(0)

    selectColor = Select(driver.find_element_by_id('colorPlayer'))
    selectColor.select_by_index(0)
    

    btnCreate = driver.find_element_by_id('btnCreateGame')
    print(f'Clicking button with text: {btnCreate.text}')
    # actionCreate = ActionChains(driver)
    # actionCreate.click(btnCreate).perform()
    # btnCreate.click()
    clickElem(driver, btnCreate)
    


    idGame = driver.find_element_by_id('gameId').text
    print(f'game created. ID {idGame} ')
    print('end')
    

def joinGame(driver,idxPlayer,idxColor, name):
    global idGame
    global ZOOMFACTOR
    print(f"Joining game {idGame} as player {name}#{idxPlayer}")
    driver.get(url_0)
    time.sleep(2)
    changeZoom(driver, ZOOMFACTOR)

    selectNrPlayer = Select(driver.find_element_by_id('nrPlayer'))
    

    selectColor = Select(driver.find_element_by_id('colorPlayer'))
  
    btnJoinGame = driver.find_element_by_id('btnJoinGame')
    fieldIdGame = driver.find_element_by_id('inputGameId')

    # send idGame as first, because otherwise it would overwride 
    # the player Number selection (keys: 1,2,3 or 4)
    fieldIdGame.send_keys(idGame)

    selectColor.select_by_index(idxColor)
    inputUserName = driver.find_element_by_id('userName')
    inputUserName.clear()
    inputUserName.send_keys(name)
    
    selectNrPlayer.select_by_index(idxPlayer)
    clickElem(driver, btnJoinGame)
    
    
def clickReady(driver):
    try:
        fieldReady = driver.find_element_by_id('fieldConfirmReady')
        clickElem(driver, fieldReady)
    except:
        pass

def clickDeal(driver):
    try:
        btnDeal = driver.find_element_by_id("fieldDealCards")
        clickElem(driver, btnDeal)
    except:
        print('dealer button not found')
        pass


def playSingleCard(driver):
    try:
        handcard_first = driver.find_element_by_xpath(
            "//div[@name='handCards']/div[1]")
        clickElem(driver, handcard_first)
        time.sleep(0.150)
        innerCircle = driver.find_element_by_xpath(
            '//div[@id = "innerCenter"]')
        clickElem(driver, innerCircle)
        return True
    except:
        print('no more cards')
        return False
        
    
        # dblClickElem(driver, driver.find_element_by_id("fieldDealCards"))

def changeZoom(driver, factor):
    driver.execute_script(f"document.body.style.zoom='{factor}%'")
    print('finished')


# -----------------------  main  -----------------------

chrome_options = webdriver.ChromeOptions()
print(chrome_options.experimental_options)
url_0 = 'http://localhost:3000'

# chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
chrome_options.add_experimental_option("excludeSwitches", ['enable-automation'])

PATH_CHROME = "C:\\Users\\alexinho\\Downloads\\chromedriver_win32\\chromedriver.exe"
WIDTH = 700
HEIGHT = 830
HEIGHT = 400
OFFSET = 40



try:
    driverCreateGame = webdriver.Chrome(executable_path=PATH_CHROME, options=chrome_options)
    driverCreateGame.implicitly_wait(1)
    time.sleep(1)
    
    driverCreateGame.set_window_position(0, 0)
    driverCreateGame.set_window_size(WIDTH, HEIGHT)

    listDriversJoin = [None, None, None]
    posWin = [[0, HEIGHT], [WIDTH + 100, 0], [WIDTH + 100, HEIGHT]]
    NUM_PLAYER_JOIN = 3
    for  i in range(0,NUM_PLAYER_JOIN):  
        listDriversJoin[i] = webdriver.Chrome(
            executable_path=PATH_CHROME, options=chrome_options)
        listDriversJoin[i].implicitly_wait(1)
        listDriversJoin[i].set_window_size(WIDTH, HEIGHT)
        x = posWin[i][0]
        y = posWin[i][1]
        listDriversJoin[i].set_window_position(x, y)

        
   
    createNewGame(driverCreateGame,'Ax')
    names = ['Bx','Cx','Dx']
    for j in range(0, len(listDriversJoin)):
        time.sleep(1)
        joinGame(listDriversJoin[j], j+1, j+1, names[j])

    allDrivers = listDriversJoin
    allDrivers.insert(0, driverCreateGame)

    sendReadyAsDefault = True
    if not sendReadyAsDefault:
        ans = input('Send ready (y/n)?')
        print(f'User send "{ans}"')

        if (ans !='y'):
            quit()

    # print('Click "ready"')
    # for i in range(0, 4):
    #     print('\t player ',i+1)
    #     clickReady(allDrivers[i])
    
    runGame = True
    while runGame:
        # click Deal button
        time.sleep(5)
        print('Click "Deal cards"')
        for i in range(0, 4):
            print('\t player ',i+1)
            clickDeal(allDrivers[i])

        # play cards
        existHandCards = True
        while existHandCards:
            for i in range(0,4):
                time.sleep(1)
                existHandCards = playSingleCard(allDrivers[i])
            if (existHandCards == False):
                print('all cards played')

    while True:
        pass        

except :
    e = sys.exc_info()[0]
    print('error:')
    print(e)
    
finally:
    pass
    driverCreateGame.quit()
    for j in range(0, len(listDriversJoin)):
        listDriversJoin[j].quit()




