using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace SetDown
{
    public partial class MainWindow : Window
    {
        private readonly ModalWindow AlertWindow;
        private readonly ComplexCounter Counter;
        private readonly List<string> RadioButtons = new() { "RadioButton0", "RadioButton1", "RadioButton2", "RadioButton3", "RadioButton4", "RadioButton5" };
        private readonly List<int> TimeoutList = new() { 1800, 3600, 5400, 7200, 9000, 10800 };

        private Thread CountDown;

        private int countSelected;

        private int DisplaySelected = 0;
        private int DisplayCount = 1;

        public MainWindow()
        {
            InitializeComponent();

            AlertWindow = new ModalWindow { Topmost = true };

            AlertWindow.ButtonClicked += Check_Modal;

            Counter = new ComplexCounter(countSelected, AlertWindow, this);

            CountDown = new Thread(ThreadCounter);

            UpdateTimeouts(sender: null, @event: null);
        }

        private void UpdateTimeouts(object? sender, EventArgs? @event)
        {
            StreamReader file;

            try { file = new("timeouts.conf"); }
            catch (Exception) { return; }

            for (int i = 0; i < RadioButtons.Count; i++)
            {
                int timeout = GetTimeout(file);

                TimeoutList[i] = timeout;

                ConfigureRadioButton(RadioButtons[i], timeout);
            }
        }

        private static int GetTimeout(StreamReader file)
        {
            string? line = file.ReadLine();

            if (line == null) return 0;

            return int.Parse(line);
        }

        private void ConfigureRadioButton(string radiobuttonName, int timeout)
        {
            Counter count = new(timeout);

            RadioButton radiobutton = Application.Current.Dispatcher.Invoke(() => (RadioButton)FindName(radiobuttonName));

            TextBlock textblock = Application.Current.Dispatcher.Invoke(() => (TextBlock)radiobutton.Content);

            Application.Current.Dispatcher.Invoke(() => textblock.Text = count.ToString());
        }

        private void DragWindow(object sender, MouseButtonEventArgs e)
        {
            if (Application.Current.Dispatcher.Invoke(() => e.ChangedButton == MouseButton.Left)) DragMove();
        }

        private void CloseApplication(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void MinimizeWindow(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void SetConfig(object sender, RoutedEventArgs e)
        {
            Process updating = Process.Start("notepad.exe", "timeouts.conf");

            updating.EnableRaisingEvents = true;

            updating.Exited += new EventHandler(UpdateTimeouts);
        }

        private void ThreadCounter()
        {
            try
            {
                while (true)
                {
                    Thread.Sleep(999);
                    UpdateTimerCounter(Counter.Next());
                }
            }
            catch (ThreadInterruptedException) { }
        }

        private void UpdateTimerCounter(string count)
        {
            if (graphCounter.Dispatcher.CheckAccess()) graphCounter.Content = count;
            else graphCounter.Dispatcher.BeginInvoke(new Action<string>(UpdateTimerCounter), count);
        }

        private void InterruptCounter()
        {
            try { CountDown.Interrupt(); }
            catch (Exception) { }

            Counter.Cancel();
            Privilege(() => owl.Visibility = Visibility.Hidden);
            Privilege(() => clock.Visibility = Visibility.Visible);
        }

        private void CancelTimeout(object sender, RoutedEventArgs e)
        {
            InterruptCounter();

            UpdateTimerCounter(Counter.ToString());

            countSelected = 0;

            UnselectRadioButtons();

            BorderCounter.Visibility = Visibility.Hidden;
        }

        private void AcceptTimeout(object sender, RoutedEventArgs e)
        {
            if (countSelected == 0) return;

            InterruptCounter();

            Counter.SetCounter(countSelected);

            CountDown = new Thread(ThreadCounter);

            CountDown.Start();

            BorderCounter.Visibility = Visibility.Hidden;

            if (countSelected <= 600) Privilege(() => AlertWindow.Show());
        }

        private void SetTimer(object sender, RoutedEventArgs e)
        {
            if (CountDown.IsAlive) return;

            if (sender is not RadioButton radioButton) return;

            int index = int.Parse(radioButton.Name[^1..]);

            countSelected = TimeoutList[index];

            Counter.SetCounter(countSelected);

            UpdateTimerCounter(Counter.ToString());
        }

        private void Check_Modal(object? sender, EventArgs e)
        {
            InterruptCounter();

            UpdateTimerCounter(Counter.ToString());

            Focus();
        }

        private void UnselectRadioButtons()
        {
            RadioButtons.ForEach(button => Uncheck(button));
        }

        private void Uncheck(string button)
        {
            RadioButton? radioButton = (RadioButton)FindName(button);
            radioButton.IsChecked = false;
        }

        private void ChangeTimerValue(object sender, RoutedEventArgs e)
        {
            if (CountDown.IsAlive) return;

            if (sender is not Button Button) return;

            if (BorderCounter.Visibility == Visibility.Hidden)
            {
                InitialTimerPosition();
                return;
            }

            switch (Button.Name)
            {
                case "Up":
                    countSelected += DisplayCount;
                    Counter.SetCounter(countSelected);
                    UpdateTimerCounter(Counter.ToString());
                    break;

                case "Down":
                    if (countSelected <= 0) return;
                    countSelected -= DisplayCount;
                    Counter.SetCounter(countSelected);
                    UpdateTimerCounter(Counter.ToString());
                    break;

                case "Left":
                    DisplaySelected++;
                    DisplaySelected %= 3;
                    UpdateTimerDisplay();
                    break;

                case "Right":
                    DisplaySelected--;
                    if (DisplaySelected == -1) DisplaySelected = 2;
                    UpdateTimerDisplay();
                    break;
            }
        }

        private void UpdateTimerDisplay()
        {
            switch (DisplaySelected)
            {
                case 0: //right
                    DisplayCount = 1;
                    BorderCounter.Margin = new Thickness(225, 65, 0, 0);
                    break;

                case 1: //mid
                    DisplayCount = 60;
                    BorderCounter.Margin = new Thickness(-5, 65, 0, 0);
                    break;

                case 2: //left
                    DisplayCount = 3600;
                    BorderCounter.Margin = new Thickness(-235, 65, 0, 0);
                    break;
            }
        }

        private void InitialTimerPosition()
        {
            DisplaySelected = 0;

            UpdateTimerDisplay();

            BorderCounter.Visibility = Visibility.Visible;
        }



        private static void Privilege(Action accion)
        {
            Application.Current.Dispatcher.Invoke(accion);
        }
    }
}